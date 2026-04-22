<?php

namespace App\Http\Controllers\StaffRoles;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware; // Ye line lazmi add karein
use Illuminate\Routing\Controllers\Middleware;

class StaffController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array

    {
        return [
            // Index aur Show ke liye 'view-staff' slug
            new Middleware('can:view-staff', only: ['index', 'show']),

            // Store (Add) ke liye 'add-staff' slug
            new Middleware('can:add-staff', only: ['store']),

            // Update (Edit) ke liye 'edit-staff' slug
            new Middleware('can:edit-staff', only: ['update']),

            // Destroy (Delete) ke liye 'delete-staff' slug
            new Middleware('can:delete-staff', only: ['destroy']),
        ];
    }

    public function index()
    {
        // 10 records per page (aap number change kar sakty hain)
        $staff = Staff::with('role')->paginate(10);
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_id'          => 'required|exists:staff_roles,id',
            'full_name'        => 'required|string|max:255',
            'email'            => 'required|email|unique:staff,email',
            'phone_number'     => 'required|string',
            'cnic_number'      => 'nullable|string',
            'address'          => 'nullable|string',
            'status'           => 'required|in:active,inactive',
            'joining_date'     => 'required|date',
            'salary'           => 'required|numeric',
            'emergency_contact' => 'nullable|string',
            'profile_image'    => 'nullable|image|max:2048',
            'cnic_front_image' => 'nullable|image|max:2048',
            'cnic_back_image'  => 'nullable|image|max:2048',
        ]);

        // File Upload Logic
        $images = ['profile_image', 'cnic_front_image', 'cnic_back_image'];
        foreach ($images as $img) {
            if ($request->hasFile($img)) {
                $validated[$img] = $request->file($img)->store('staff_docs', 'public');
            }
        }

        $staff = Staff::create($validated);
        return response()->json(['message' => 'Staff added successfully', 'data' => $staff], 201);
    }

    public function show(Staff $staff)
    {
        return response()->json($staff->load('role'));
    }

    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $validated = $request->validate([
            'full_name'     => 'sometimes|required|string',
            'email'         => 'sometimes|required|email|unique:staff,email,' . $id,
            'role_id'       => 'sometimes|required',
            'cnic_front'    => 'nullable|image|max:2048',
            'cnic_back'     => 'nullable|image|max:2048',
            'profile_image' => 'nullable|image|max:2048',
            // Baki fields automatically logic mein handle ho jayenge
        ]);

        $data = $request->all();

        // Image Update Logic
        foreach (['profile_image', 'cnic_front', 'cnic_back'] as $fileKey) {
            if ($request->hasFile($fileKey)) {
                // Delete old file
                if ($staff->$fileKey) {
                    Storage::disk('public')->delete($staff->$fileKey);
                }
                // Save new file
                $data[$fileKey] = $request->file($fileKey)->store('staff_docs', 'public');
            }
        }

        $staff->update($data);
        return response()->json(['message' => 'Staff updated successfully', 'data' => $staff]);
    }

    public function destroy(Staff $staff)
    {
        // Delete images from storage before deleting record
        $images = [$staff->profile_image, $staff->cnic_front_image, $staff->cnic_back_image];
        foreach ($images as $img) {
            if ($img) Storage::disk('public')->delete($img);
        }

        $staff->delete();
        return response()->json(['message' => 'Staff deleted successfully']);
    }
}
