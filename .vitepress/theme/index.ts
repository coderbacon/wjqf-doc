// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PasswordProtected from './components/PasswordProtected.vue'
import ImageViewer from './components/ImageViewer.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('PasswordProtected', PasswordProtected)
    app.component('ImageViewer', ImageViewer)
  }
} satisfies Theme
