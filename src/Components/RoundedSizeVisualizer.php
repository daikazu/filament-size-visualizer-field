<?php

namespace Daikazu\FilamentSizeVisualizerField\Components;

use Closure;
use Filament\Forms\Components\Field;
use Illuminate\Contracts\Support\Htmlable;

class RoundedSizeVisualizer extends Field
{
    protected string $view = 'filament-size-visualizer-field::components.size-visualizer';
    protected int|Closure|null $size = 1080;
    protected int|Closure|null $padding = 50;
    protected float|int|Closure|null $dynamicObjectSize = 2.5;
    protected string|Closure|null $dynamicObjectImage = 'images/product-image-2.png';
    protected float|int|Closure|null $staticObjectSize = 0.955;
    protected string|Closure|null $staticObjectImage = 'images/quarter-image.png';
    protected bool|Closure|null $showStaticObject = true;
    protected string|Closure|null $fontFamily = 'Arial';
    protected string|Closure|null $backgroundColor = '#DFE1E6';
    protected string|Closure|null $gridLineColor = 'rgba(0, 0, 0, 0.25)';
    protected string|Closure|null $halfGridLineColor = 'rgba(0, 0, 0, 0.20)';
    protected string|Closure|null $patternGridColor = 'rgba(100, 100, 255, .50)';
    protected string|Closure|null $sizeText = 'Inches';


    public static function make(string $name): static
    {
        $static = parent::make($name);

        $static->default(0);

        return $static;
    }

    public function size(int|Closure $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getSize(): int|Htmlable|null
    {
        return $this->evaluate($this->size);
    }

    public function sizeText(string|Closure $sizeText): static
    {
        $this->sizeText = $sizeText;

        return $this;
    }

    public function getSizeText(): string|Htmlable|null
    {
        return $this->evaluate($this->sizeText);
    }

    public function padding(int|Closure $padding): static
    {
        $this->padding = $padding;

        return $this;
    }

    public function getPadding(): int|Htmlable|null
    {
        return $this->evaluate($this->padding);
    }

    public function dynamicObjectSize(float|int|Closure $dynamicObjectSize): static
    {
        $this->dynamicObjectSize = $dynamicObjectSize;

        return $this;
    }

    public function getDynamicObjectSize(): float|int|null
    {
        return $this->evaluate($this->dynamicObjectSize);
    }

    public function dynamicObjectImage(string|Closure $dynamicObjectImage): static
    {
        $this->dynamicObjectImage = $dynamicObjectImage;

        return $this;
    }

    public function getDynamicObjectImage(): string|Htmlable|null
    {
        return $this->evaluate($this->dynamicObjectImage);
    }

    public function staticObjectSize(float|int|Closure $staticObjectSize): static
    {
        $this->staticObjectSize = $staticObjectSize;

        return $this;
    }

    public function getStaticObjectSize(): float|int|null
    {
        return $this->evaluate($this->staticObjectSize);
    }

    public function staticObjectImage(string|Closure $staticObjectImage): static
    {
        $this->staticObjectImage = $staticObjectImage;

        return $this;
    }

    public function getStaticObjectImage(): string|Htmlable|null
    {
        return $this->evaluate($this->staticObjectImage);
    }

    public function fontFamily(string|Closure $fontFamily): static
    {
        $this->fontFamily = $fontFamily;

        return $this;
    }

    public function getFontFamily(): string|Htmlable|null
    {
        return $this->evaluate($this->fontFamily);
    }

    public function backgroundColor(string|Closure $backgroundColor): static
    {
        $this->backgroundColor = $backgroundColor;

        return $this;
    }

    public function getBackgroundColor(): string|Htmlable|null
    {
        return $this->evaluate($this->backgroundColor);
    }

    public function gridLineColor(string|Closure $gridLineColor): static
    {
        $this->gridLineColor = $gridLineColor;

        return $this;
    }

    public function getGridLineColor(): string|Htmlable|null
    {
        return $this->evaluate($this->gridLineColor);
    }

    public function halfGridLineColor(string|Closure $halfGridLineColor): static
    {
        $this->halfGridLineColor = $halfGridLineColor;

        return $this;
    }

    public function getHalfGridLineColor(): string|Htmlable|null
    {
        return $this->evaluate($this->halfGridLineColor);
    }

    public function patternGridColor(string|Closure $patternGridColor): static
    {
        $this->patternGridColor = $patternGridColor;

        return $this;
    }

    public function getPatternGridColor(): string|Htmlable|null
    {
        return $this->evaluate($this->patternGridColor);
    }

    public function showStaticObject(bool|Closure $showStaticObject): static
    {
        $this->showStaticObject = $showStaticObject;

        return $this;
    }

    public function getShowStaticObject(): bool|Htmlable|null
    {
        return $this->evaluate($this->showStaticObject);
    }
}
