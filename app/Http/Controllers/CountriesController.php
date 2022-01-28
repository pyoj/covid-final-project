<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CountriesController extends Controller
{
    public function list(Request $request)
    {
        return [
            'result' => Country::select(['id', 'name'])
                ->where('name', 'LIKE', '%' . $request->input("input") . '%')
                ->take(10)
                ->get()
        ];
    }

    public function get_saved_countries(Request $request)
    {
        return ['result' => $request->user()->get_saved_countries()->get()];
    }

    public function create_saved_country(Request $request)
    {

        $validation = Validator::make($request->all(), [
            'country_id' => 'required|unique:App\Models\SavedCountries,country_id,user_id'
        ]);

        if ($validation->fails()) {
            return Response::json(array(
                'code' => 409,
                'message' => 'already exists!'
            ), 409);
        }

        Country::findorFail($request->input("country_id"));

        $request->user()->get_saved_countries()->attach($request->input("country_id"));
        $request->user()->save();

        return ["message" => "Added successfully"];
    }

    public function delete_saved_country(Request $request, $country_code)
    {
        $country = Country::where('code', $country_code)->firstOrFail();

        $request->user()->get_saved_countries()->detach($country->id);
        $request->user()->save();

        return ["message" => "Deleted successfully"];
    }
}
