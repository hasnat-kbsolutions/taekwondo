<?php

return [
    /*
    |--------------------------------------------------------------------------
    | User Roles Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for user roles, their permissions,
    | and hierarchical relationships in the Taekwondo application.
    |
    */

    'roles' => [
        'admin' => [
            'name' => 'Administrator',
            'description' => 'Full system access and control',
            'level' => 1,
            'permissions' => ['*'], // All permissions
            'dashboard_route' => 'admin.dashboard',
            'can_manage_users' => true,
            'can_manage_roles' => true,
        ],

        'organization' => [
            'name' => 'Organization Admin',
            'description' => 'Organization-level administration',
            'level' => 2,
            'permissions' => [
                'organization.*',
                'club.*',
                'instructor.*',
                'student.*',
                'attendance.*',
                'payment.*',
                'certification.*',
            ],
            'dashboard_route' => 'organization.dashboard',
            'can_manage_users' => true,
            'can_manage_roles' => false,
        ],

        'club' => [
            'name' => 'Club Manager',
            'description' => 'Club-level management',
            'level' => 3,
            'permissions' => [
                'club.*',
                'instructor.*',
                'student.*',
                'attendance.*',
                'payment.*',
                'certification.*',
            ],
            'dashboard_route' => 'club.dashboard',
            'can_manage_users' => true,
            'can_manage_roles' => false,
        ],

        'instructor' => [
            'name' => 'Instructor',
            'description' => 'Taekwondo instructor',
            'level' => 4,
            'permissions' => [
                'student.*',
                'attendance.*',
                'certification.*',
                'payment.view',
            ],
            'dashboard_route' => 'instructor.dashboard',
            'can_manage_users' => false,
            'can_manage_roles' => false,
        ],

        'student' => [
            'name' => 'Student',
            'description' => 'Taekwondo student',
            'level' => 5,
            'permissions' => [
                'attendance.view',
                'payment.view',
                'certification.view',
                'profile.*',
            ],
            'dashboard_route' => 'student.dashboard',
            'can_manage_users' => false,
            'can_manage_roles' => false,
        ],

        'guardian' => [
            'name' => 'Guardian',
            'description' => 'Parent or guardian of student',
            'level' => 5,
            'permissions' => [
                'student.view',
                'attendance.view',
                'payment.view',
                'certification.view',
                'profile.*',
            ],
            'dashboard_route' => 'guardian.dashboard',
            'can_manage_users' => false,
            'can_manage_roles' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Role Hierarchy
    |--------------------------------------------------------------------------
    |
    | Defines which roles can access resources of other roles
    |
    */

    'hierarchy' => [
        'admin' => ['admin', 'organization', 'club', 'instructor', 'student', 'guardian'],
        'organization' => ['organization', 'club', 'instructor', 'student', 'guardian'],
        'club' => ['club', 'instructor', 'student', 'guardian'],
        'instructor' => ['instructor', 'student'],
        'student' => ['student'],
        'guardian' => ['guardian'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Role
    |--------------------------------------------------------------------------
    |
    | The default role assigned to new users
    |
    */

    'default_role' => 'student',

    /*
    |--------------------------------------------------------------------------
    | Role Guards
    |--------------------------------------------------------------------------
    |
    | The authentication guards used for each role
    |
    */

    'guards' => [
        'admin' => 'admin',
        'organization' => 'organization',
        'club' => 'club',
        'instructor' => 'instructor',
        'student' => 'student',
        'guardian' => 'guardian',
    ],
];
