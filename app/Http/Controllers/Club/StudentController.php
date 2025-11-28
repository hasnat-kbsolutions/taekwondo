<?php

namespace App\Http\Controllers\Club;
use App\Http\Controllers\Controller;

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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Notifications\StudentFeePlanAssigned;

class StudentController extends Controller
{
    public function index(Request $request)
    {

        $students = Student::query()
            ->when(Auth::user()->role === 'club', function ($query) {
                $query->where('organization_id', Auth::user()->userable->organization_id);
                $query->where('club_id', Auth::user()->userable_id);
            })
            ->when($request->organization_id, function ($query) use ($request) {
                $query->where('organization_id', $request->organization_id);
            })
            ->latest()->get()
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

        return Inertia::render('Club/Students/Index', [
            'students' => $students,
            'organizationId' => $request->organization_id,
        ]);
    }


    public function create()
    {
        $user = Auth::user();
        $clubId = $user->userable_id;

        $clubs = Club::select('id', 'name')->get();

        // Get plans for this club only
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('planable_id', $clubId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Club/Students/Create', [
            'clubs' => $clubs,
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;

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
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
            // Plan assignment fields
            'plan_id' => [
                'required',
                'exists:plans,id',
                function ($attribute, $value, $fail) use ($clubId) {
                    $plan = Plan::find($value);
                    if (!$plan || $plan->planable_type !== 'App\Models\Club' || $plan->planable_id !== $clubId) {
                        $fail('The selected plan does not belong to your club.');
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

        // Enforce interval_count if custom
        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        // Generate UID
        $validated['uid'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        $validated['code'] = 'STD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        // Handle image uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from validated to prevent overwriting existing file with null
                unset($validated[$field]);
            }
        }

        // Inject organization_id if the logged-in user is a club
        if ($user->role === 'club') {
            $validated['club_id'] = $clubId;
            $validated['organization_id'] = $user->userable->organization_id;
        }

        // Create student profile
        $student = Student::create($validated);

        // Create user only if email is provided
        if (!empty($validated['email'])) {
            $student->user()->create([
                'name' => $validated['name'] . ' ' . ($validated['surname'] ?? ''),
                'email' => $validated['email'],
                'password' => Hash::make($request->password),
                'role' => 'student',
            ]);
        }

        // Create student fee plan
        $discountType = $validated['discount_type'] ?: null;
        $discountValue = $discountType ? (float) $validated['discount_value'] : 0;

        $feePlan = StudentFeePlan::create([
            'student_id' => $student->id,
            'plan_id' => $validated['plan_id'],
            'interval' => $validated['interval'],
            'interval_count' => $validated['interval_count'] ?? null,
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'currency_code' => $validated['currency_code'] ?? null,
            'is_active' => true,
        ]);

        // Send notification to student if user account was created
        if ($student->user) {
            $student->notify(new StudentFeePlanAssigned($feePlan));
        }

        return redirect()->route('club.students.index')->with('success', 'Student created successfully');
    }

    public function edit(Student $student)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;

        // Verify student belongs to club
        if ($student->club_id !== $clubId) {
            abort(403, 'Unauthorized to access this student.');
        }

        // Get plans for this club only
        $plans = Plan::where('planable_type', 'App\Models\Club')
            ->where('planable_id', $clubId)
            ->where('is_active', true)
            ->get();

        // Load existing fee plan
        $student->load('feePlan');

        return Inertia::render('Club/Students/Edit', [
            'student' => $student,
            'plans' => $plans,
            'currencies' => Currency::where('is_active', true)->get(),
            'feePlan' => $student->feePlan,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $user = Auth::user();
        $clubId = $user->userable_id;

        // Verify student belongs to club
        if ($student->club_id !== $clubId) {
            abort(403, 'Unauthorized to update this student.');
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'surname' => 'nullable|string',
            'nationality' => 'required|string',
            'dob' => 'required|date',
            'dod' => 'nullable|date',
            'grade' => 'required|string',
            'gender' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'identification_document' => 'nullable|mimes:pdf|max:2048',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'street' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'required|boolean',
            // Plan assignment fields
            'plan_id' => [
                'required',
                'exists:plans,id',
                function ($attribute, $value, $fail) use ($clubId) {
                    $plan = Plan::find($value);
                    if (!$plan || $plan->planable_type !== 'App\Models\Club' || $plan->planable_id !== $clubId) {
                        $fail('The selected plan does not belong to your club.');
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

        // Enforce interval_count if custom
        if ($validated['interval'] === 'custom' && empty($validated['interval_count'])) {
            return back()->withErrors(['interval_count' => 'Interval count is required when using custom interval.'])->withInput();
        }

        // Handle image uploads
        foreach (['profile_image', 'identification_document'] as $field) {
            if ($request->hasFile($field)) {
                $relativePath = $request->file($field)->store("students", "public");
                $validated[$field] = $relativePath; // Store relative path only
            } else {
                // Remove from validated to prevent overwriting existing file with null
                unset($validated[$field]);
            }
        }

        // Update the student record
        $student->update($validated);

        // Create or update user account
        if (!empty($validated['email'])) {
            $userData = [
                'name' => $validated['name'] . ' ' . ($validated['surname'] ?? ''),
                'role' => 'student',
                'organization_id' => $student->organization_id,
                'club_id' => $student->club_id,
                'student_id' => $student->id,
            ];

            // Only include password if it's provided
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            User::updateOrCreate(
                ['email' => $validated['email']],
                $userData
            );
        }

        // Create or update student fee plan
        $discountType = $validated['discount_type'] ?: null;
        $discountValue = $discountType ? (float) $validated['discount_value'] : 0;

        $feePlan = StudentFeePlan::updateOrCreate(
            ['student_id' => $student->id],
            [
                'plan_id' => $validated['plan_id'],
                'interval' => $validated['interval'],
                'interval_count' => $validated['interval_count'] ?? null,
                'discount_type' => $discountType,
                'discount_value' => $discountValue,
                'currency_code' => $validated['currency_code'] ?? null,
                'is_active' => true,
            ]
        );

        // Send notification to student if fee plan was updated and user account exists
        if ($student->user) {
            $student->notify(new StudentFeePlanAssigned($feePlan));
        }

        return redirect()
            ->route('club.students.index')
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

        return redirect()->route('club.students.index')->with('success', 'Student and associated user deleted');
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

            return redirect()->route('club.students.index')->with('success', 'Password updated successfully');
        }

        return redirect()->route('club.students.index')->with('error', 'No user account found for this student');
    }
}

