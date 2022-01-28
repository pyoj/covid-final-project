<?php

use App\Http\Controllers\CountriesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/countries/list', [CountriesController::class, 'list']);

Route::get('/countries/saved', [CountriesController::class, 'get_saved_countries']);
Route::post('/countries/create/saved', [CountriesController::class, 'create_saved_country']);
Route::delete('/countries/saved/{country_code}', [CountriesController::class, 'delete_saved_country']);
