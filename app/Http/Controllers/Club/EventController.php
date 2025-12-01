<?php

namespace App\Http\Controllers\Club;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the events
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $club = $user->userable;

        $query = Event::with(['creator'])
            ->where('club_id', $club->id)
            ->where('organization_id', $club->organization_id);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by event type
        if ($request->event_type) {
            $query->where('event_type', $request->event_type);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->where('event_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('event_date', '<=', $request->date_to);
        }

        $events = $query->latest('event_date')->get();

        return Inertia::render('Club/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['status', 'event_type', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new event
     */
    public function create()
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Club/Events/Create');
    }

    /**
     * Store a newly created event in storage
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        $club = $user->userable;

        // Validate form data - times are completely optional
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_type' => 'required|string|in:training,competition,seminar,meeting,other',
            'event_date' => 'required|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'status' => 'required|in:upcoming,ongoing,completed',
            'is_public' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        // Time fields are optional - no format validation required
        // Simply trim and set to null if empty
        $validated['start_time'] = !empty(trim($validated['start_time'] ?? ''))
            ? trim($validated['start_time'])
            : null;
        $validated['end_time'] = !empty(trim($validated['end_time'] ?? ''))
            ? trim($validated['end_time'])
            : null;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = 'event_' . time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('events', $filename, 'public');
            $validated['image'] = $path;
        }

        // Handle document upload
        if ($request->hasFile('document')) {
            $document = $request->file('document');
            $filename = 'event_doc_' . time() . '.' . $document->getClientOriginalExtension();
            $path = $document->storeAs('events/documents', $filename, 'public');
            $validated['document'] = $path;
        }

        Event::create([
            ...$validated,
            'club_id' => $club->id,
            'organization_id' => $club->organization_id,
            'created_by' => $user->id,
        ]);

        return redirect()->route('club.events.index')->with('success', 'Event created successfully.');
    }

    /**
     * Show the form for editing the specified event
     */
    public function edit(Event $event)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        // Verify event belongs to club
        if ($event->club_id !== $user->userable_id) {
            abort(403, 'Unauthorized');
        }

        $event->load(['club', 'organization']);

        return Inertia::render('Club/Events/Edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified event
     */
    public function update(Request $request, Event $event)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        // Verify event belongs to club
        if ($event->club_id !== $user->userable_id) {
            abort(403, 'Unauthorized');
        }

        // Validate form data - times are completely optional
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_type' => 'required|string|in:training,competition,seminar,meeting,other',
            'event_date' => 'required|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'status' => 'required|in:upcoming,ongoing,completed',
            'is_public' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'remove_image' => 'boolean',
            'remove_document' => 'boolean',
        ]);

        // Time fields are optional - preserve existing values if not provided/empty
        // Simply trim empty values and keep the existing event times
        if (empty(trim($validated['start_time'] ?? ''))) {
            $validated['start_time'] = $event->start_time;
        } else {
            $validated['start_time'] = trim($validated['start_time']);
        }

        if (empty(trim($validated['end_time'] ?? ''))) {
            $validated['end_time'] = $event->end_time;
        } else {
            $validated['end_time'] = trim($validated['end_time']);
        }

        // Prepare update data - only include fields that should be updated
        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'event_type' => $validated['event_type'],
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'venue' => $validated['venue'],
            'status' => $validated['status'],
            'is_public' => $validated['is_public'],
        ];

        // Handle image upload/removal
        if ($request->hasFile('image')) {
            // Delete old image
            if ($event->image) {
                $oldFile = storage_path('app/public/' . $event->image);
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }

            $image = $request->file('image');
            $filename = 'event_' . time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('events', $filename, 'public');
            $updateData['image'] = $path;
        } elseif ($request->boolean('remove_image')) {
            // Delete image if removal is requested
            if ($event->image) {
                $oldFile = storage_path('app/public/' . $event->image);
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }
            $updateData['image'] = null;
        }
        // If neither upload nor remove, don't include image in update - it stays unchanged

        // Handle document upload/removal
        if ($request->hasFile('document')) {
            // Delete old document
            if ($event->document) {
                $oldFile = storage_path('app/public/' . $event->document);
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }

            $document = $request->file('document');
            $filename = 'event_doc_' . time() . '.' . $document->getClientOriginalExtension();
            $path = $document->storeAs('events/documents', $filename, 'public');
            $updateData['document'] = $path;
        } elseif ($request->boolean('remove_document')) {
            // Delete document if removal is requested
            if ($event->document) {
                $oldFile = storage_path('app/public/' . $event->document);
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }
            $updateData['document'] = null;
        }
        // If neither upload nor remove, don't include document in update - it stays unchanged

        $event->update($updateData);

        return redirect()->route('club.events.index')->with('success', 'Event updated successfully.');
    }

    /**
     * Remove the specified event
     */
    public function destroy(Event $event)
    {
        $user = Auth::user();
        if ($user->role !== 'club') {
            abort(403, 'Unauthorized');
        }

        // Verify event belongs to club
        if ($event->club_id !== $user->userable_id) {
            abort(403, 'Unauthorized');
        }

        // Delete event image
        if ($event->image) {
            $filePath = storage_path('app/public/' . $event->image);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        // Delete event document
        if ($event->document) {
            $filePath = storage_path('app/public/' . $event->document);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $event->delete();

        return redirect()->route('club.events.index')->with('success', 'Event deleted successfully.');
    }
}

