<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\Admin;
use App\Models\Organization;
use App\Models\Club;
use App\Models\Instructor;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_admin_can_authenticate_using_admin_login(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'userable_type' => Admin::class,
            'userable_id' => $admin->id,
        ]);

        $response = $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_organization_can_authenticate_using_organization_login(): void
    {
        $organization = Organization::factory()->create();
        $user = User::factory()->create([
            'role' => 'organization',
            'userable_type' => Organization::class,
            'userable_id' => $organization->id,
        ]);

        $response = $this->post('/organization/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('organization.dashboard', absolute: false));
    }

    public function test_club_can_authenticate_using_club_login(): void
    {
        $club = Club::factory()->create();
        $user = User::factory()->create([
            'role' => 'club',
            'userable_type' => Club::class,
            'userable_id' => $club->id,
        ]);

        $response = $this->post('/club/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('club.dashboard', absolute: false));
    }

    public function test_instructor_can_authenticate_using_instructor_login(): void
    {
        $instructor = Instructor::factory()->create();
        $user = User::factory()->create([
            'role' => 'instructor',
            'userable_type' => Instructor::class,
            'userable_id' => $instructor->id,
        ]);

        $response = $this->post('/instructor/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('instructor.dashboard', absolute: false));
    }

    public function test_student_can_authenticate_using_student_login(): void
    {
        $student = Student::factory()->create();
        $user = User::factory()->create([
            'role' => 'student',
            'userable_type' => Student::class,
            'userable_id' => $student->id,
        ]);

        $response = $this->post('/student/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('student.dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_wrong_role(): void
    {
        $user = User::factory()->create(['role' => 'student']);

        $response = $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(['email']);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_role_specific_logout_works(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->post('/admin/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
