<?php

namespace App\Http\Controllers\Organization;
use App\Http\Controllers\Controller;
use App\Http\Controllers\GradeHistoryController;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Club;
use App\Models\Organization;
use App\Models\Plan;

use App\Models\User;
use App\Models\Currency;
use App\Models\StudentFeePlan;
use App\Notifications\StudentFeePlanAssigned;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        $students = Student::query()
            ->with(['organization', 'club']) // eager load relations
            ->where('organization_id', $organizationId)
            ->whereHas('club', function ($query) use ($organizationId) {
                // Only include students whose clubs belong to THIS organization
                $query->where('organization_id', $organizationId);
            })
            ->when($request->filled('nationality') && $request->nationality !== 'all', function ($query) use ($request) {
                $query->where('nationality', $request->nationality);
            })
            ->when($request->filled('country') && $request->country !== 'all', function ($query) use ($request) {
                $query->where('country', $request->country);
            })
            ->when($request->filled('status') && $request->status !== 'all', function ($query) use ($request) {
                $query->where('status', $request->status === 'active' ? true : false);
            })
            ->latest()
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'uid' => $student->uid,
                    'code' => $student->code,
                    'name' => $student->name,
                    'surname' => $student->surname,
                    'email' => $student->email,
                    'phone' => $student->phone,
                    'grade' => $student->grade,
                    'gender' => $student->gender,
                    'nationality' => $student->nationality,
                    'country' => $student->country,
                    'status' => $student->status,
                    'organization' => $student->organization,
                    'club' => $student->club,
                    'average_rating' => $student->average_rating,
                    'total_ratings' => $student->total_ratings,
                    'profile_image' => $student->profile_image,
                    'identification_document' => $student->identification_document,
                    'dob' => $student->dob,
                    'dod' => $student->dod,
                    'id_passport' => $student->id_passport,
                    'city' => $student->city,
                    'postal_code' => $student->postal_code,
                    'street' => $student->street,
                ];
            });

        return Inertia::render('Organization/Students/Index', [
            'students' => $students,
            'nationalities' => Student::where('organization_id', $organizationId)
                ->whereHas('club', function ($query) use ($organizationId) {
                    $query->where('organization_id', $organizationId);
                })
                ->select('nationality')
                ->distinct()
                ->pluck('nationality'),
            'countries' => Student::where('organization_id', $organizationId)
                ->whereHas('club', function ($query) use ($organizationId) {
                    $query->where('organization_id', $organizationId);
                })
                ->select('country')
                ->distinct()
                ->pluck('country'),
            'filters' => [
                'nationality' => $request->nationality,
                'country' => $request->country,
                'status' => $request->status,
            ],
        ]);
    }


    public function create()
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        // Get only organization-level plans
        $plans = Plan::where('is_active', true)
            ->where('planable_type', 'App\Models\Organization')
            ->where('planable_id', $organizationId)
            ->get(['id', 'name', 'base_amount', 'currency_code', 'planable_id', 'planable_type']);

        return Inertia::render('Organization/Students/Create', [
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }


    public function store(Request $request)
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        // Validate required fields
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'phone' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'required|string',
            'dob' => 'required|date',
            'dod' => 'nullable|date',
            'grade' => 'required|string',
            'gender' => 'required|string',
            'id_passport' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
            'plan_id' => [
                'nullable',
                'exists:plans,id',
                function ($attribute, $value, $fail) use ($organizationId) {
                    if (!$value) {
                        return; // Plan is optional
                    }

                    $plan = Plan::find($value);
                    if (
                        !$plan ||
                        $plan->planable_type !== 'App\Models\Organization' ||
                        (int) $plan->planable_id !== (int) $organizationId
                    ) {
                        $fail('The selected plan does not belong to your organization.');
                    }
                },
            ],
            'interval' => 'nullable|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'currency_code' => 'nullable|exists:currencies,code',
        ]);

        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        $planFields = ['plan_id', 'interval', 'interval_count', 'discount_type', 'discount_value', 'currency_code'];
        $planData = Arr::only($validated, $planFields);
        $studentData = Arr::except($validated, $planFields);

        // Generate UID
        $studentData['uid'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        $studentData['code'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        // Handle image uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $studentData[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from validated to prevent overwriting existing file with null
                unset($studentData[$field]);
            }
        }

        // Inject organization_id if the logged-in user is an organization
        if ($user->role === 'organization') {
            $studentData['organization_id'] = $organizationId;

            // Auto-assign to first available club of the organization
            $firstClub = Club::where('organization_id', $organizationId)->first();
            if ($firstClub) {
                $studentData['club_id'] = $firstClub->id;
            }
        }

        // Create student
        $student = Student::create($studentData);

        // Create linked user (if email provided)
        if (!empty($studentData['email'])) {
            $student->user()->create([
                'name' => trim($studentData['name'] . ' ' . ($studentData['surname'] ?? '')),
                'email' => $studentData['email'],
                'password' => Hash::make($request->password),
                'role' => 'student',
            ]);
        }

        // Create fee plan if a plan was selected (when club is assigned)
        if (!empty($planData['plan_id'])) {
            $planData['discount_type'] = $planData['discount_type'] ?: null;
            $planData['discount_value'] = $planData['discount_type'] ? (float) $planData['discount_value'] : 0;

            StudentFeePlan::create([
                'student_id' => $student->id,
                'plan_id' => $planData['plan_id'],
                'interval' => $planData['interval'] ?? 'monthly',
                'interval_count' => $planData['interval_count'] ?? null,
                'discount_type' => $planData['discount_type'],
                'discount_value' => $planData['discount_value'],
                'currency_code' => $planData['currency_code'] ?? null,
                'is_active' => true,
            ]);
        }

        return redirect()->route('organization.students.index')->with('success', 'Student created successfully');


    }

    public function edit(Student $student)
    {

        $user = Auth::user();
        $organizationId = $user->userable_id;

        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to access this student.');
        }

        // Verify the student's club belongs to this organization
        if ($student->club && $student->club->organization_id !== $organizationId) {
            abort(403, 'This student\'s club does not belong to your organization.');
        }

        // Get only organization-level plans
        $plans = Plan::where('is_active', true)
            ->where('planable_type', 'App\Models\Organization')
            ->where('planable_id', $organizationId)
            ->get(['id', 'name', 'base_amount', 'currency_code', 'planable_id', 'planable_type']);

        $student->load('feePlan');

        return Inertia::render('Organization/Students/Edit', [
            'student' => $student,
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
            'feePlan' => $student->feePlan,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to update this student.');
        }

        // Verify the student's club belongs to this organization
        if ($student->club && $student->club->organization_id !== $organizationId) {
            abort(403, 'This student\'s club does not belong to your organization.');
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'nullable|string|min:6',
            'phone' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'required|string',
            'dob' => 'required|date',
            'dod' => 'nullable|date',
            'grade' => 'required|string',
            'gender' => 'required|string',
            'id_passport' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
            'plan_id' => [
                'nullable',
                'exists:plans,id',
                function ($attribute, $value, $fail) use ($organizationId) {
                    if (!$value) {
                        return; // Plan is optional
                    }

                    $plan = Plan::find($value);
                    if (
                        !$plan ||
                        $plan->planable_type !== 'App\Models\Organization' ||
                        (int) $plan->planable_id !== (int) $organizationId
                    ) {
                        $fail('The selected plan does not belong to your organization.');
                    }
                },
            ],
            'interval' => 'nullable|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'currency_code' => 'nullable|exists:currencies,code',
        ]);

        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        $planFields = ['plan_id', 'interval', 'interval_count', 'discount_type', 'discount_value', 'currency_code'];
        $planData = Arr::only($validated, $planFields);
        $studentData = Arr::except($validated, $planFields);

        // Handle image uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $studentData[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from validated to prevent overwriting existing file with null
                unset($studentData[$field]);
            }
        }

        // Check if grade has changed and record it
        $oldGrade = $student->grade;
        $newGrade = $studentData['grade'] ?? $student->grade;

        // Update the student record
        $student->update($studentData);

        // Record grade change if it occurred
        if ($oldGrade !== $newGrade) {
            GradeHistoryController::recordGradeChange($student, $newGrade, 'Grade updated', $oldGrade);
        }

        // Create or update user account
        if (!empty($studentData['email'])) {
            $userData = [
                'name' => $studentData['name'] . ' ' . ($studentData['surname'] ?? ''),
                'role' => 'student',
                'userable_type' => 'App\Models\Student',
                'userable_id' => $student->id,
            ];

            // Only include password if it's provided
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            User::updateOrCreate(
                ['email' => $studentData['email']],
                $userData
            );
        }

        // Update or create fee plan if a plan was selected (when club is assigned)
        if (!empty($planData['plan_id'])) {
            $planData['discount_type'] = $planData['discount_type'] ?: null;
            $planData['discount_value'] = $planData['discount_type'] ? (float) $planData['discount_value'] : 0;

            $feePlan = StudentFeePlan::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'plan_id' => $planData['plan_id'],
                    'interval' => $planData['interval'] ?? 'monthly',
                    'interval_count' => $planData['interval_count'] ?? null,
                    'discount_type' => $planData['discount_type'],
                    'discount_value' => $planData['discount_value'],
                    'currency_code' => $planData['currency_code'] ?? null,
                    'is_active' => true,
                ]
            );

            // Send notification to student if they have a user account
            if ($student->user) {
                $student->notify(new StudentFeePlanAssigned($feePlan));
            }
        }

        return redirect()
            ->route('organization.students.index')
            ->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $user = Auth::user();
        $organizationId = $user->userable_id;

        if ($student->organization_id !== $organizationId) {
            abort(403, 'Unauthorized to delete this student.');
        }

        // Verify the student's club belongs to this organization
        if ($student->club && $student->club->organization_id !== $organizationId) {
            abort(403, 'This student\'s club does not belong to your organization.');
        }

        // Delete related user if exists
        if ($student->user) {
            $student->user->delete();
        }

        if ($student->profile_image) {
            Storage::disk('public')->delete($student->profile_image);
        }
        if ($student->identification_document) {
            Storage::disk('public')->delete($student->identification_document);
        }

        // Then delete the student
        $student->delete();

        return redirect()->route('organization.students.index')->with('success', 'Student and associated user deleted');
    }

    public function updatePassword(Request $request, Student $student)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Update the user's password if the student has a linked user
        $user = User::where('email', $student->email)->first();

        if ($user) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return redirect()->route('organization.students.index')->with('success', 'Password updated successfully');
        }

        return redirect()->route('organization.students.index')->with('error', 'No user account found for this student');
    }
}

