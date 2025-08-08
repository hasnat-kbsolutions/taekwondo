<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Storage;
class CertificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Certification::with(['student.club.organization']);

        // Apply filters
        if ($request->filled('organization_id')) {
            $query->whereHas('student.club', function ($q) use ($request) {
                $q->where('organization_id', $request->organization_id);
            });
        }

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
            })->orWhereHas('student.club.organization', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $certifications = $query->get()
            ->map(function ($certification) {
                return [
                    'id' => $certification->id,
                    'student_name' => $certification->student->name,
                    'club_name' => $certification->student->club->name,
                    'organization_name' => $certification->student->club->organization->name,
                    'file' => $certification->file,
                    'issued_at' => $certification->issued_at
                        ? \Carbon\Carbon::parse($certification->issued_at)->toDateString()
                        : null,
                    'notes' => $certification->notes,
                ];
            });

        $organizations = \App\Models\Organization::all(['id', 'name']);
        $clubs = \App\Models\Club::all(['id', 'name', 'organization_id']);

        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => $certifications,
            'organizations' => $organizations,
            'clubs' => $clubs,
            'filters' => $request->only(['organization_id', 'club_id', 'search']),
        ]);
    }

    public function create()
    {
        $organizations = \App\Models\Organization::all(['id', 'name']);
        $clubs = \App\Models\Club::all(['id', 'name', 'organization_id']);
        $students = \App\Models\Student::all(['id', 'name', 'club_id', 'organization_id']);
        Log::info('Organizations:', $organizations->toArray());
        Log::info('Clubs:', $clubs->toArray());
        Log::info('Students:', $students->toArray());
        return Inertia::render('Admin/Certifications/Create', [
            'organizations' => $organizations,
            'clubs' => $clubs,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
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
            $student->organization_id != $validated['organization_id']
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
            return redirect()->route('admin.certifications.index')->with('success', 'Certification assigned successfully.');
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
        $certification = Certification::with('student')->findOrFail($id);

        $students = \App\Models\Student::with(['club.organization'])->get();
        
        return Inertia::render('Admin/Certifications/Edit', [
            'certification' => $certification,
            'students' => $students,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'issued_at' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);
        $certification = Certification::with('student')->findOrFail($id);

        try {
            $data = [
                'student_id' => $validated['student_id'],
                'issued_at' => $validated['issued_at'],
                'notes' => $validated['notes'],
            ];

            if ($request->hasFile('file')) {
                $data['file'] = $request->file('file')->store('certificates', 'public');
            }

            $certification->update($data);

            return redirect()->route('admin.certifications.index')->with('success', 'Certification updated successfully.');
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
        try {
            // Delete the file from storage if it exists
            if ($certificate->file && Storage::disk('public')->exists($certificate->file)) {
                Storage::disk('public')->delete($certificate->file);
            }
            $certificate->delete();
            return redirect()->route('admin.certifications.index')->with('success', 'Certification deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Certification deletion failed: ' . $e->getMessage(), [
                'exception' => $e,
                'certificate_id' => $certificate->id,
            ]);
            return back()->withErrors(['file' => 'Failed to delete certificate: ' . $e->getMessage()]);
        }
    }
}