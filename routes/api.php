<?php

use App\Http\Controllers;
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

Route::get('to-dos')->name('to-dos.index')->uses([Controllers\ToDoController::class, 'index']);
Route::post('to-dos')->name('to-dos.store')->uses([Controllers\ToDoController::class, 'store']);
Route::put('to-dos/{id}')->name('to-dos.update')->uses([Controllers\ToDoController::class, 'update']);
