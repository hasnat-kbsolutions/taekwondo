<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of events for the student's club
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'student') {
            abort(403, 'Unauthorized');
        }

        $student = $user->userable;

        $query = Event::with(['club', 'creator'])
            ->where('club_id', $student->club_id)
            ->where('organization_id', $student->organization_id)
            ->where('is_public', true);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by event type
        if ($request->event_type) {
            $query->where('event_type', $request->event_type);
        }

        // Only show upcoming events by default
        if (!$request->status || $request->status === 'upcoming') {
            $query->where('event_date', '>=', now()->toDateString());
        }

        $events = $query->orderBy('event_date', 'asc')->get();

        return Inertia::render('Student/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['status', 'event_type']),
        ]);
    }

    /**
     * Show event details
     */
    public function show(Event $event)
    {
        $user = Auth::user();
        if ($user->role !== 'student') {
            abort(403, 'Unauthorized');
        }

        $student = $user->userable;

        // Verify event is for student's club
        if ($event->club_id !== $student->club_id || $event->organization_id !== $student->organization_id) {
            abort(403, 'You do not have access to this event.');
        }

        $event->load(['club', 'organization', 'creator']);

        return Inertia::render('Student/Events/Show', [
            'event' => $event,
        ]);
    }
}

