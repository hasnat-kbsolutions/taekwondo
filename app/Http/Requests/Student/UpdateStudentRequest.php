<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'club_id' => ['required', 'integer', 'exists:clubs,id'],
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],

            // Required fields
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'dob' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'nationality' => ['required', 'string', 'max:100'],
            'grade' => ['required', 'string', 'max:50'],
            'id_passport' => ['required', 'string', 'max:100'],

            // Password is optional for updates
            'password' => ['nullable', 'string', 'min:6', 'max:255'],

            // Optional fields
            'surname' => ['nullable', 'string', 'max:255'],
            'dod' => ['nullable', 'date', 'after:dob'],
            'profile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'identification_document' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'city' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'street' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'club_id.required' => 'Club selection is required.',
            'club_id.exists' => 'The selected club is invalid.',
            'organization_id.required' => 'Organization selection is required.',
            'organization_id.exists' => 'The selected organization is invalid.',
            'name.required' => 'Student name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered by another student.',
            'phone.required' => 'Phone number is required.',
            'dob.required' => 'Date of birth is required.',
            'dob.before' => 'Date of birth must be in the past.',
            'gender.required' => 'Gender selection is required.',
            'gender.in' => 'Please select a valid gender.',
            'nationality.required' => 'Nationality is required.',
            'grade.required' => 'Grade/level is required.',
            'id_passport.required' => 'ID/Passport number is required.',
            'password.min' => 'Password must be at least 6 characters.',
            'dod.after' => 'Date of death must be after date of birth.',
            'profile_image.image' => 'Profile image must be an image file.',
            'profile_image.mimes' => 'Profile image must be in JPG, JPEG, or PNG format.',
            'profile_image.max' => 'Profile image size must not exceed 2MB.',
            'identification_document.mimes' => 'Identification document must be in PDF format.',
            'identification_document.max' => 'Identification document size must not exceed 2MB.',
            'status.required' => 'Status selection is required.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'club_id' => 'club',
            'organization_id' => 'organization',
            'name' => 'student name',
            'email' => 'email address',
            'phone' => 'phone number',
            'dob' => 'date of birth',
            'dod' => 'date of death',
            'gender' => 'gender',
            'nationality' => 'nationality',
            'grade' => 'grade/level',
            'id_passport' => 'ID/passport number',
            'password' => 'password',
            'surname' => 'surname',
            'profile_image' => 'profile image',
            'identification_document' => 'identification document',
            'city' => 'city',
            'postal_code' => 'postal code',
            'street' => 'street address',
            'country' => 'country',
            'status' => 'status',
        ];
    }
}
