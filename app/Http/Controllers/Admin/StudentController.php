<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Controllers\GradeHistoryController;

use App\Models\Student;
use App\Models\Plan;
use App\Models\StudentFeePlan;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Club;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Exports\StudentExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::query()
            ->with(['organization', 'club']) // eager load relations
            ->when($request->filled('organization_id') && $request->organization_id !== 'all', function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->when($request->filled('club_id') && $request->club_id !== 'all', function ($query) use ($request) {
                $query->where('club_id', $request->club_id);
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
                    'city' => $student->city,
                    'postal_code' => $student->postal_code,
                    'street' => $student->street,
                ];
            });

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'organizations' => Organization::select('id', 'name')->get(),
            'clubs' => Club::select('id', 'name')->get(),
            'nationalities' => Student::select('nationality')->distinct()->pluck('nationality'),
            'countries' => Student::select('country')->distinct()->pluck('country'),
            'filters' => [
                'organization_id' => $request->organization_id,
                'club_id' => $request->club_id,
                'nationality' => $request->nationality,
                'country' => $request->country,
                'status' => $request->status,
            ],
        ]);
    }



    public function create()
    {

        $clubs = Club::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('is_active', true)
            ->get(['id', 'name', 'base_amount', 'currency_code', 'planable_id']);

        return Inertia::render('Admin/Students/Create', [
            'clubs' => $clubs,
            'organizations' => $organizations,
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        // Validate required fields
        $validated = $request->validate([
            'club_id' => 'required|integer',
            'organization_id' => 'required|integer',

            // Required fields
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'password' => 'required|string|min:6',
            'dob' => 'required|date',
            'gender' => 'required|string',
            'nationality' => 'required|string',
            'grade' => 'required|string',

            // Optional fields
            'surname' => 'nullable|string',
            'dod' => 'nullable|date',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',

            // Plan assignment
            'plan_id' => [
                'required',
                'exists:plans,id',
                function ($attribute, $value, $fail) use ($request) {
                    $plan = Plan::find($value);
                    if (
                        !$plan ||
                        $plan->planable_type !== 'App\Models\Club' ||
                        (int) $plan->planable_id !== (int) $request->input('club_id')
                    ) {
                        $fail('The selected plan does not belong to the selected club.');
                    }
                },
            ],
            'interval' => 'required|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::requiredIf(function () use ($request) {
                    $type = $request->input('discount_type');
                    return in_array($type, ['percent', 'fixed']);
                }),
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

        // Handle file uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $studentData[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from data to prevent overwriting existing file with null
                unset($studentData[$field]);
            }
        }

        // Create student
        $student = Student::create($studentData);

        // Record initial grade in grade history
        if (!empty($studentData['grade'])) {
            GradeHistoryController::recordGradeChange($student, $studentData['grade'], 'Initial grade assigned');
        }

        // Create linked user (if email provided)
        if (!empty($studentData['email'])) {
            $student->user()->create([
                'name' => trim($studentData['name'] . ' ' . ($studentData['surname'] ?? '')),
                'email' => $studentData['email'],
                'password' => Hash::make($request->password),
                'role' => 'student',
            ]);
        }

        $planData['discount_type'] = $planData['discount_type'] ?: null;
        $planData['discount_value'] = $planData['discount_type'] ? (float) $planData['discount_value'] : 0;

        StudentFeePlan::create([
            'student_id' => $student->id,
            'plan_id' => $planData['plan_id'],
            'interval' => $planData['interval'],
            'interval_count' => $planData['interval_count'] ?? null,
            'discount_type' => $planData['discount_type'],
            'discount_value' => $planData['discount_value'],
            'currency_code' => $planData['currency_code'] ?? null,
            'is_active' => true,
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student created successfully');
    }

    public function edit(Student $student)
    {
        $clubs = Club::select('id', 'name')->get();
        $organizations = Organization::select('id', 'name')->get();
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('is_active', true)
            ->get(['id', 'name', 'base_amount', 'currency_code', 'planable_id']);

        $student->load('feePlan');

        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'clubs' => $clubs,
            'organizations' => $organizations,
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
            'feePlan' => $student->feePlan,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'club_id' => 'required|integer',
            'organization_id' => 'required|integer',

            // Required fields
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'dob' => 'required|date',
            'gender' => 'required|string',
            'nationality' => 'required|string',
            'grade' => 'required|string',

            // Password is optional
            'password' => 'nullable|string|min:6',

            // Optional fields
            'surname' => 'nullable|string',
            'dod' => 'nullable|date',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
            'plan_id' => [
                'required',
                'exists:plans,id',
                function ($attribute, $value, $fail) use ($request) {
                    $plan = Plan::find($value);
                    if (
                        !$plan ||
                        $plan->planable_type !== 'App\Models\Club' ||
                        (int) $plan->planable_id !== (int) $request->input('club_id')
                    ) {
                        $fail('The selected plan does not belong to the selected club.');
                    }
                },
            ],
            'interval' => 'required|in:monthly,quarterly,semester,yearly,custom',
            'interval_count' => 'nullable|integer|min:1',
            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::requiredIf(function () use ($request) {
                    $type = $request->input('discount_type');
                    return in_array($type, ['percent', 'fixed']);
                }),
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
                'organization_id' => $studentData['organization_id'] ?? null,
                'club_id' => $studentData['club_id'] ?? null,
                'student_id' => $student->id,
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

        $planData['discount_type'] = $planData['discount_type'] ?: null;
        $planData['discount_value'] = $planData['discount_type'] ? (float) $planData['discount_value'] : 0;

        StudentFeePlan::updateOrCreate(
            ['student_id' => $student->id],
            [
                'plan_id' => $planData['plan_id'],
                'interval' => $planData['interval'],
                'interval_count' => $planData['interval_count'] ?? null,
                'discount_type' => $planData['discount_type'],
                'discount_value' => $planData['discount_value'],
                'currency_code' => $planData['currency_code'] ?? null,
                'is_active' => true,
            ]
        );

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'Student updated successfully');
    }


    public function destroy(Student $student)
    {
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

        return redirect()->route('admin.students.index')->with('success', 'Student and associated user deleted');
    }


    public function export()
    {
        return Excel::download(new StudentExport, 'students.xlsx');
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

            return redirect()->route('admin.students.index')->with('success', 'Password updated successfully');
        }

        return redirect()->route('admin.students.index')->with('error', 'No user account found for this student');
    }

}
