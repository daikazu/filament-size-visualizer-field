const preset = require('./vendor/filament/support/tailwind.config.preset')

module.exports = {
    presets: [preset],
    content: [
        './resources/views/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
    ],
}
