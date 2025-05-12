<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::with('images')->get();
        return Inertia::render('Locations/Index', [
            'locations' => $locations,
        ]);
    }

    public function create()
    {
        return Inertia::render('Locations/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitude' => 'required|numeric|between:-180,180',
            'latitude' => 'required|numeric|between:-90,90',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $location = Location::create($request->only('name', 'description', 'longitude', 'latitude'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('location_images', 'public');
                $location->images()->create(['image_path' => $path]);
            }
        }

        return redirect()->route('locations.index')->with('success', 'Location created successfully');
    }

    public function edit(Location $location)
    {
        return Inertia::render('Locations/Edit', [
            'location' => $location->load('images'),
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitude' => 'required|numeric|between:-180,180',
            'latitude' => 'required|numeric|between:-90,90',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $location->update($request->only('name', 'description', 'longitude', 'latitude'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('location_images', 'public');
                $location->images()->create(['image_path' => $path]);
            }
        }

        return redirect()->route('locations.index')->with('success', 'Location updated successfully');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('locations.index')->with('success', 'Location deleted successfully');
    }
}