# Backend Routes to Add (Laravel)

## 1. Add Route in `routes/api.php`:

```php
// User Profile Update
Route::post('/user/update-profile', [UserController::class, 'updateProfile'])->middleware('auth:sanctum');
```

## 2. Add Method in `app/Http/Controllers/UserController.php`:

```php
public function updateProfile(Request $request)
{
    $user = auth()->user();
    
    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }
    
    // Update basic info
    if ($request->has('name')) {
        $user->name = $request->name;
    }
    if ($request->has('email')) {
        $user->email = $request->email;
    }
    if ($request->has('phone')) {
        $user->phone = $request->phone;
    }
    
    // Handle profile picture upload
    if ($request->hasFile('profile_picture')) {
        // Delete old profile picture if exists
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }
        
        // Store new profile picture
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');
        $user->profile_picture = $path;
    }
    
    $user->save();
    
    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => [
            'user' => $user
        ]
    ]);
}
```

## 3. Add Column to Users Table (if not exists):

Run this migration:

```bash
php artisan make:migration add_profile_picture_to_users_table
```

Then in the migration file:

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('profile_picture')->nullable()->after('email');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('profile_picture');
    });
}
```

Run the migration:
```bash
php artisan migrate
```

## 4. Make sure to import at the top of UserController:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
```

---

After adding these to your Laravel backend, the profile update will work!
