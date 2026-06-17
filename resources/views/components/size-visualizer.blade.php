@php
    // Stable id so the Alpine component persists across Livewire renders
    // (a random id would force a teardown/rebuild and defeat the animation).
    $visualizerId = 'visualizer-' . \Illuminate\Support\Str::slug($getStatePath());
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    {{-- showStaticObject is passed as a reactive data attribute (Livewire morphs
         it in place) rather than baked into x-data, which stays static so the
         component is never re-initialised. --}}
    <div
        x-load
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-rounded-size-visualizer-script', 'daikazu/filament-size-visualizer-field') }}"
        x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('filament-rounded-size-visualizer-style', 'daikazu/filament-size-visualizer-field'))]"
        id="{{ $visualizerId }}"
        data-show-static="{{ $getShowStaticObject() ? '1' : '0' }}"
        x-data="roundedSizeVisualizer({
            element: @js($visualizerId),
            state: $wire.$entangle('{{ $getStatePath() }}'),
            size: @js($getSize()),
            sizeText: @js($getSizeText()),
            padding: @js($getPadding()),
            dynamicObjectImage: @js($getDynamicObjectImage()),
            staticObjectSize: @js($getStaticObjectSize()),
            staticObjectImage: @js($getStaticObjectImage()),
            fontFamily: @js($getFontFamily()),
            backgroundColor: @js($getBackgroundColor()),
            gridLineColor: @js($getGridLineColor()),
            halfGridLineColor: @js($getHalfGridLineColor()),
            patternGridColor: @js($getPatternGridColor()),
        })"
        x-on:resize-size-visualizer.window="handleResize()"
        x-on:dispose-size-visualizer.window="destroy()"
    >
        {{-- fabric.js rewrites the <canvas> into its own wrapper DOM; wire:ignore
             stops Livewire morphing (which would tear that DOM out on each update). --}}
        <div x-ref="canvasWrapper" class="filament-size-visualizer" wire:ignore>
            <canvas x-ref="canvas"></canvas>
        </div>
    </div>
</x-dynamic-component>
