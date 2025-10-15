<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentExport implements FromCollection, WithMapping, WithHeadings
{
    public function collection()
    {
        return Student::with(['club', 'organization'])->get();
    }

    public function map($student): array
    {
        return [
            optional($student->club)->name,
            optional($student->organization)->name,
            $student->name,
            $student->surname,
            $student->email,
            $student->phone,
            $student->dob,
            $student->dod,
            $student->gender,
            $student->nationality,
            $student->grade,
            $student->id_passport,
            $student->city,
            $student->postal_code,
            $student->street,
            $student->country,
            $student->status ? 'Active' : 'Inactive',
        ];
    }

    public function headings(): array
    {
        return [
            'Club',
            'Organization',
            'Name',
            'Surname',
            'Email',
            'Phone',
            'Date of Birth',
            'Date of Deactivation',
            'Gender',
            'Nationality',
            'Grade',
            'ID/Passport',
            'Skype',
            'Website',
            'City',
            'Postal Code',
            'Street',
            'Country',
            'Status',
        ];
    }
}
