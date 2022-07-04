<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ToDo>
 */
class ToDoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'title' => $this->faker->words(asText: true),
            'completed' => $this->faker->boolean(),
        ];
    }

    /**
     * Indicate that the ToDo should be currently incomplete.
     *
     * @return $this
     */
    public function incomplete(): self
    {
        return $this->state(function () {
            return [
                'completed' => false,
            ];
        });
    }
}
