<?php

namespace App\Http\Controllers;

use App\Models\ToDo;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ToDoController
{
    /**
     * Create a new controller instance.
     *
     * @param \Illuminate\Contracts\Routing\ResponseFactory $response
     * @param \App\Models\ToDo $toDo
     *
     * @return void
     */
    public function __construct(
        protected ResponseFactory $response,
        protected ToDo $toDo,
    ) {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $toDo = $this->toDo->newQuery()->create([
            'title' => $request->input('title'),
        ]);

        return $this->response->json([
            'id' => $toDo->getKey(),
            'title' => $toDo->title,
            'completed' => (bool) $toDo->completed,
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
