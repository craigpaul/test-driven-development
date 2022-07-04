<?php

namespace Tests\Feature;

use App\Models\ToDo;
use function route;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CanPerformVariousActionsWithToDosTest extends TestCase
{
    use DatabaseTransactions;
    use WithFaker;

    public function testCanCreateNewToDo()
    {
        $title = $this->faker->words(asText: true);

        $this->withoutExceptionHandling()
            ->postJson(route('to-dos.store'), [
                'title' => $title,
            ])
            ->assertCreated()
            ->assertJsonStructure([
                'id',
                'title',
                'completed',
            ])
            ->assertJsonFragment([
                'title' => $title,
                'completed' => false,
            ]);

        $this->assertDatabaseHas(ToDo::class, [
            'title' => $title,
            'completed' => false,
        ]);
    }

    public function testCanReadExistingToDos()
    {
        $toDos = ToDo::factory()->count(3)->create();

        $response = $this->withoutExceptionHandling()
            ->getJson(route('to-dos.index'))
            ->assertOk()
            ->assertJsonStructure([
                [
                    'id',
                    'title',
                    'completed',
                ],
            ]);

        foreach ($toDos as $toDo) {
            $response->assertJsonFragment([
                'id' => $toDo->getKey(),
                'title' => $toDo->title,
                'completed' => (bool) $toDo->completed,
            ]);
        }
    }

    public function testCanUpdateExistingToDo()
    {
        $toDo = ToDo::factory()->incomplete()->create();

        $this->withoutExceptionHandling()
            ->putJson(route('to-dos.update', [
                'id' => $toDo->getKey(),
            ]), [
                'completed' => true,
            ])
            ->assertOk()
            ->assertJsonStructure([
                'id',
                'title',
                'completed',
            ])
            ->assertJsonFragment([
                'id' => $toDo->getKey(),
                'title' => $toDo->title,
                'completed' => true,
            ]);

        $this->assertDatabaseHas(ToDo::class, [
            'id' => $toDo->getKey(),
            'completed' => true,
        ]);
    }

    public function testCanChangeTheTitleOfExistingToDo()
    {
        $toDo = ToDo::factory()->create();

        $title = $this->faker->word();

        $this->withoutExceptionHandling()
            ->putJson(route('to-dos.update', [
                'id' => $toDo->getKey(),
            ]), [
                'title' => $title,
            ])
            ->assertOk()
            ->assertJsonStructure([
                'id',
                'title',
                'completed',
            ])
            ->assertJsonFragment([
                'id' => $toDo->getKey(),
                'title' => $title,
                'completed' => $toDo->completed,
            ]);

        $this->assertDatabaseHas(ToDo::class, [
            'id' => $toDo->getKey(),
            'title' => $title,
        ]);
    }

    public function testCanDeleteExistingToDo()
    {
        $toDo = ToDo::factory()->create();

        $this->withoutExceptionHandling()
            ->delete(route('to-dos.destroy', [
                'id' => $toDo->getKey(),
            ]))
            ->assertNoContent();

        $this->assertDatabaseMissing(ToDo::class, [
            'id' => $toDo->getKey(),
        ]);
    }
}
