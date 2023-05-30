import postcssPresetEnv from 'postcss-preset-env';

const config = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
      },
    }),
  ],
};

export default config;
