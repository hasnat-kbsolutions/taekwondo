<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // CRUD permissions
        $entities = ['club', 'organization', 'supporter', 'student', 'attendance'];
        $actions = ['create', 'edit', 'delete', 'list'];

        $permissions = [];

        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                $permissions[] = "$entity-$action";
            }
        }

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        $club = Role::firstOrCreate(['name' => 'Club']);
        $supporter = Role::firstOrCreate(['name' => 'Supporter']);
        $student = Role::firstOrCreate(['name' => 'Student']);
        $parent = Role::firstOrCreate(['name' => 'Parent']);

        // Give all permissions to superadmin
        $superadmin->syncPermissions(Permission::all());

        // Assign selective permissions to other roles if needed
        $club->syncPermissions(Permission::all()); // Optional if you want Club to act like an admin
    }
}

