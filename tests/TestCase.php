<?php

namespace Daikazu\FilamentSizeVisualizerField\Tests;

use Daikazu\FilamentSizeVisualizerField\FilamentSizeVisualizerFieldServiceProvider;
use Illuminate\Database\Eloquent\Factories\Factory;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();

        Factory::guessFactoryNamesUsing(
            fn (string $modelName) => 'Daikazu\\FilamentSizeVisualizerField\\Database\\Factories\\' . class_basename($modelName) . 'Factory'
        );
    }

    public function getEnvironmentSetUp($app)
    {
        config()->set('database.default', 'testing');

        /*
        $migration = include __DIR__.'/../database/migrations/create_filament-size-visualizer-field_table.php.stub';
        $migration->up();
        */
    }

    protected function getPackageProviders($app)
    {
        return [
            FilamentSizeVisualizerFieldServiceProvider::class,
        ];
    }
}
