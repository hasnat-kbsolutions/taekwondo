<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class CertificationController extends Controller
{
    public function index(Request $request)
    {
        $organization = Auth::user()->userable;

        $query = Certification::with(['student.club'])
            ->whereHas('student.club', function ($q) use ($organization) {
                $q->where('organization_id', $organization->id);
            })->latest();

        // Apply filters
        if ($request->filled('club_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('club_id', $request->club_id);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('student.club', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $certifications = $query->get()
            ->map(function ($certification) {
                return [
                    'id' => $certification->id,
                    'student_name' => $certification->student->name,
                    'club_name' => $certification->student->club->name,
                    'file' => $certification->file,
                    'issued_at' => $certification->issued_at
                        ? \Carbon\Carbon::parse($certification->issued_at)->toDateString()
                        : null,
                    'notes' => $certification->notes,
                ];
            });

        $clubs = $organization->clubs()->get(['id', 'name']);

        return Inertia::render('Organization/Certifications/Index', [
            'certifications' => $certifications,
            'clubs' => $clubs,
            'filters' => $request->only(['club_id', 'search']),
        ]);
    }

    public function create()
    {
        $organization = Auth::user()->userable;
        $clubs = $organization->clubs()->get(['id', 'name']);
        $students = $organization->students()->with(['club'])->get(['id', 'name', 'club_id']);

        return Inertia::render('Organization/Certifications/Create', [
            'clubs' => $clubs,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
 
        $organization = Auth::user()->userable;

        // Validate the request
        $validated = $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'student_id' => 'required|exists:students,id',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // Max 10MB
            'issued_at' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Verify student belongs to the selected club and organization
        $student = \App\Models\Student::findOrFail($validated['student_id']);
        if (
            $student->club_id != $validated['club_id'] ||
            $student->organization_id != $organization->id
        ) {
            return back()->withErrors([
                'student_id' => 'The selected student does not belong to the chosen club or organization.',
            ]);
        }

        // Use a database transaction to ensure data consistency
        DB::beginTransaction();
        try {
            // Store the file
            $filePath = $request->file('file')->store('certificates', 'public');
            if (!$filePath) {
                throw new Exception('File storage failed.');
            }

            // Create the certificate
            $certificate = Certification::create([
                'student_id' => $validated['student_id'],
                'file' => $filePath,
                'issued_at' => $validated['issued_at'],
                'notes' => $validated['notes'],
            ]);

            DB::commit();
            return redirect()->route('organization.certifications.index')->with('success', 'Certification assigned successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            // Log the actual error for debugging
            Log::error('Certification creation failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'file_path' => $filePath ?? 'N/A',
            ]);
            return back()->withErrors([
                'file' => 'Failed to create certificate: ' . $e->getMessage(),
            ]);
        }
    }

    public function edit($id)
    {
        $organization = Auth::user()->userable;

        $certification = Certification::with('student')->findOrFail($id);

        // Verify the certification belongs to this organization
        if ($certification->student->club->organization_id !== $organization->id) {
            abort(403, 'Unauthorized access to this certification.');
        }

        $certification = $certification->load(['student.club']);
        $students = $organization->students()->with(['club'])->get();

        return Inertia::render('Organization/Certifications/Edit', [
            'certification' => $certification,
            'students' => $students,
        ]);
    }

    public function update(Request $request,$id)
    {
        $organization = Auth::user()->userable;
        $certification = Certification::with('student')->findOrFail($id);

        // Verify the certification belongs to this organization
        if ($certification->student->club->organization_id !== $organization->id) {
            abort(403, 'Unauthorized access to this certification.');
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'issued_at' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Verify the new student belongs to this organization
        $student = \App\Models\Student::findOrFail($validated['student_id']);
        if ($student->organization_id !== $organization->id) {
            return back()->withErrors([
                'student_id' => 'The selected student does not belong to this organization.',
            ]);
        }

        try {
            $data = [
                'student_id' => $validated['student_id'],
                'issued_at' => $validated['issued_at'],
                'notes' => $validated['notes'],
            ];

            if ($request->hasFile('file')) {
                $data['file'] = $request->file('file')->store('certifications', 'public');
            }

            $certification->update($data);

            return redirect()->route('organization.certifications.index')->with('success', 'Certification updated successfully.');
        } catch (\Exception $e) {
            Log::error('Certification update failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return back()->withErrors(['file' => 'Failed to update certificate: ' . $e->getMessage()]);
        }
    }

    public function destroy(Certification $certificate)
    {
        $organization = Auth::user()->userable;

        // Verify the certification belongs to this organization
        if ($certificate->student->club->organization_id !== $organization->id) {
            abort(403, 'Unauthorized access to this certification.');
        }

        try {
            // Delete the file from storage if it exists
            if ($certificate->file && Storage::disk('public')->exists($certificate->file)) {
                Storage::disk('public')->delete($certificate->file);
            }
            $certificate->delete();
            return redirect()->route('organization.certifications.index')->with('success', 'Certification deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Certification deletion failed: ' . $e->getMessage(), [
                'exception' => $e,
                'certificate_id' => $certificate->id,
            ]);
            return back()->withErrors(['file' => 'Failed to delete certificate: ' . $e->getMessage()]);
        }
    }
}