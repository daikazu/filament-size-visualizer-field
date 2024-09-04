@php
    $visualizerId = str(Str::random(10))->prepend('visualizer-')->toString();
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :id="$getId()" :label="$getLabel()"
    :label-sr-only="$isLabelHidden()"
    :helper-text="$getHelperText()"
    :hint="$getHint()"
    :hint-icon="$getHintIcon()"
    :required="$isRequired()"
    :state-path="$getStatePath()"
    style="margin-bottom:50px"

>
    <div
        style="display: none"
    >
        {{ $getChildComponentContainer() }}
    </div>


<div
    ax-load
    ax-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-rounded-size-visualizer-script', 'daikazu/filament-size-visualizer-field') }}"
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('filament-rounded-size-visualizer-style', 'daikazu/filament-size-visualizer-field'))]"
    id="{{ $visualizerId }}"
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
        showStaticObject: @js($getShowStaticObject()),
    })"
>

    <div x-ref="canvasWrapper" class="filament-size-visualizer">
        <canvas x-ref="canvas"></canvas>
    </div>

</div>


</x-dynamic-component>
