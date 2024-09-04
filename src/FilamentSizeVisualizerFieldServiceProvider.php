<?php

namespace Daikazu\FilamentSizeVisualizerField;

use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentSizeVisualizerFieldServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-size-visualizer-field';

    public static string $viewNamespace = 'filament-size-visualizer-field';

    public function configurePackage(Package $package): void
    {
        $package
            ->name(self::$name)
            ->hasAssets()
            ->hasViews();
    }

    public function packageBooted()
    {
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );
    }

    protected function getAssetPackageName(): ?string
    {
        return 'daikazu/filament-size-visualizer-field';
    }

    protected function getAssets(): array
    {
        return [
            AlpineComponent::make('filament-rounded-size-visualizer-script', __DIR__ . '/../resources/dist/components/filament-rounded-size-visualizer.js'),
            Css::make('filament-rounded-size-visualizer-style', __DIR__ . '/../resources/dist/filament-rounded-size-visualizer.css'),
        ];
    }
}
