# Size Visualizer Field for FilamentPHP

[![Latest Version on Packagist](https://img.shields.io/packagist/v/daikazu/filament-size-visualizer-field.svg?style=flat-square)](https://packagist.org/packages/daikazu/filament-size-visualizer-field)
[![Total Downloads](https://img.shields.io/packagist/dt/daikazu/filament-size-visualizer-field.svg?style=flat-square)](https://packagist.org/packages/daikazu/filament-size-visualizer-field)

This repository contains a custom size visualizer component for FilamentPHP. It dynamically renders and resizes a visual comparison between a selected product size and a static object (e.g., a coin) on an interactive grid


## Installation

You can install the package via composer:

```bash
composer require daikazu/filament-size-visualizer-field
```
You can publish the views using

```bash
php artisan vendor:publish --tag="filament-size-visualizer-field-views"
```

## Usage

```php

public function getFormSchema(): array
    {
        return [
            Section::make('Filament Size Visualizer Example')
                ->schema([
                    Fieldset::make('Rounded Size Visualizer')
                        ->columns(1)
                        ->schema([

                            TextInput::make('size')
                                ->debounce(600)
                                ->type('range')
                                ->minValue(1)
                                ->maxValue(15)
                                ->extraInputAttributes(['step' => 0.25])
                                ->live()
                                ->numeric()
                                ->default(2),

                            Toggle::make('show_coin')
                                ->live(),

                            RoundedSizeVisualizer::make('size')
                                ->size(960)
                                ->padding(50)
                                ->sizeText('Inches')
                                ->staticObjectImage(asset('vendor/filament-size-visualizer-field/assets/quarter.png'))
                                ->dynamicObjectImage(asset('vendor/filament-size-visualizer-field/assets/example-1.png'))
                                ->showStaticObject(fn (Get $get) => $get('show_coin')),
                        ]),
                ]),

        ];
    }

```

## Available Properties

| Property             | Type      | Description                                      | Default Value              |
|----------------------|-----------|--------------------------------------------------|----------------------------|
| `size`               | `number`  | The height of the canvas.                        | `1080`                     |
| `sizeText`           | `string`  | Text to append to display size                   | `Inches`                   |
| `padding`            | `number`  | Padding around the canvas grid.                  | `50`                       |
| `dynamicObjectImage` | `string`  | URL of the dynamic object image (e.g., product). | `''` (empty string)        |
| `staticObjectSize`   | `number`  | Size of the static object in the visualizer.     | `0.955`                    |
| `staticObjectImage`  | `string`  | URL of the static object image (e.g., coin).     | `''` (empty string)        |
| `fontFamily`         | `string`  | Font family for text elements on the canvas.     | `Arial`                    |
| `backgroundColor`    | `string`  | Background color of the canvas.                  | `#DFE1E6`                  |
| `gridLineColor`      | `string`  | Color of the main grid lines (inch markers).     | `rgba(0, 0, 0, 0.25)`      |
| `halfGridLineColor`  | `string`  | Color of the half-inch grid lines.               | `rgba(0, 0, 0, 0.20)`      |
| `patternGridColor`   | `string`  | Color used in the pattern overlay.               | `rgba(100, 100, 255, .50)` |
| `showStaticObject`   | `boolean` | Whether to show the static object on the canvas. | `true`                     |




## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Mike Wall](https://github.com/daikazu)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
