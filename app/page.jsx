'use client'

import { useState, useEffect, useRef } from 'react'

const LOCALIZATIONS = ['Russian', 'English', 'Spanish', 'Kazakh', 'Turkish', 'Uzbek']

const STORAGE_KEY = 'yandex-game-generator-state'

const DEFAULT_ONBOARDING = [
  {
    title: 'Как много времени у вас на игру?',
    options: ['<3 мин.', '5-10 мин.', '>15 мин.'],
  },
  {
    title: 'Играли ли Вы раньше в головоломки?',
    options: ['Да, много раз', 'Играл иногда', 'Почти не играл'],
  },
]

const CATEGORIES = [
  'Puzzle',
  'Arcade',
  'Runner',
  'Strategy',
  'RPG',
  'Simulation',
  'Sports',
  'Racing',
  'Card',
  'Board',
  'Match-3',
  'Idle / Clicker',
  'Shooter',
  'Platformer',
  'Quiz / Trivia',
  'Other',
]

export default function Home() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  const [titles, setTitles] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [usedTitle, setUsedTitle] = useState(null)
  const [titlesLoading, setTitlesLoading] = useState(false)
  const [titlesError, setTitlesError] = useState(null)
  const [titleLanguage, setTitleLanguage] = useState('Russian')

  const [logoPrompt, setLogoPrompt] = useState('')
  const [includeTitleInLogo, setIncludeTitleInLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)
  const [logoLoading, setLogoLoading] = useState(false)
  const [logoError, setLogoError] = useState(null)

  const [maskableUrl, setMaskableUrl] = useState(null)
  const [maskableLoading, setMaskableLoading] = useState(false)
  const [maskableError, setMaskableError] = useState(null)

  const [coverUrl, setCoverUrl] = useState(null)
  const [coverLoading, setCoverLoading] = useState(false)
  const [coverError, setCoverError] = useState(null)

  const [seoTexts, setSeoTexts] = useState({})
  const [seoLoading, setSeoLoading] = useState(false)
  const [seoError, setSeoError] = useState(null)

  const [catalogDescs, setCatalogDescs] = useState({})
  const [catalogDescLoading, setCatalogDescLoading] = useState(false)
  const [catalogDescError, setCatalogDescError] = useState(null)
  const [catalogDescHint, setCatalogDescHint] = useState('')

  const [howToPlayTexts, setHowToPlayTexts] = useState({})
  const [howToPlayLoading, setHowToPlayLoading] = useState(false)
  const [howToPlayError, setHowToPlayError] = useState(null)
  const [howToPlayHint, setHowToPlayHint] = useState('')

  const [onboardingScreens, setOnboardingScreens] = useState(DEFAULT_ONBOARDING)

  const [onboardingTranslations, setOnboardingTranslations] = useState({})
  const [onboardingTransLoading, setOnboardingTransLoading] = useState(false)
  const [onboardingTransError, setOnboardingTransError] = useState(null)

  const [orientation, setOrientation] = useState('both')
  const [platform, setPlatform] = useState('both')
  const [framework, setFramework] = useState('React')
  const [gameCodePath, setGameCodePath] = useState('')
  const [yandexMetrika, setYandexMetrika] = useState('')
  const [testingChecklistPath, setTestingChecklistPath] = useState('')
  const [referenceScreenshots, setReferenceScreenshots] = useState([])
  const [localizations, setLocalizations] = useState([])

  const [keywords, setKeywords] = useState([])
  const [keywordsLoading, setKeywordsLoading] = useState(false)
  const [keywordsError, setKeywordsError] = useState(null)

  const [aiProvider, setAiProvider] = useState('claude-cli')
  const [gameSessionId, setGameSessionId] = useState(null)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameLogs, setGameLogs] = useState([])
  const [gameReply, setGameReply] = useState('')
  const logsEndRef = useRef(null)

  const TABS = ['General', 'Technical']
  const [activeTab, setActiveTab] = useState('General')

  const [hydrated, setHydrated] = useState(false)

  // Restore from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.description != null) setDescription(s.description)
        if (s.category != null) setCategory(s.category)
        if (s.titles != null) setTitles(s.titles)
        if (s.usedTitle != null) setUsedTitle(s.usedTitle)
        if (s.titleLanguage != null) setTitleLanguage(s.titleLanguage)
        if (s.logoPrompt != null) setLogoPrompt(s.logoPrompt)
        if (s.includeTitleInLogo != null) setIncludeTitleInLogo(s.includeTitleInLogo)
        if (s.logoUrl != null) setLogoUrl(s.logoUrl)
        if (s.maskableUrl != null) setMaskableUrl(s.maskableUrl)
        if (s.coverUrl != null) setCoverUrl(s.coverUrl)
        if (s.seoTexts != null) setSeoTexts(s.seoTexts)
        if (s.catalogDescs != null) setCatalogDescs(s.catalogDescs)
        if (s.catalogDescHint != null) setCatalogDescHint(s.catalogDescHint)
        if (s.howToPlayTexts != null) setHowToPlayTexts(s.howToPlayTexts)
        if (s.howToPlayHint != null) setHowToPlayHint(s.howToPlayHint)
        if (s.onboardingScreens != null) setOnboardingScreens(s.onboardingScreens)
        if (s.onboardingTranslations != null) setOnboardingTranslations(s.onboardingTranslations)
        if (s.orientation != null) setOrientation(s.orientation)
        if (s.platform != null) setPlatform(s.platform)
        if (s.framework != null) setFramework(s.framework)
        if (s.gameCodePath != null) setGameCodePath(s.gameCodePath)
        if (s.yandexMetrika != null) setYandexMetrika(s.yandexMetrika)
        if (s.testingChecklistPath != null) setTestingChecklistPath(s.testingChecklistPath)
        if (s.referenceScreenshots != null) setReferenceScreenshots(s.referenceScreenshots)
        if (s.localizations != null) setLocalizations(s.localizations)
        if (s.keywords != null) setKeywords(s.keywords)
        if (s.activeTab != null) setActiveTab(s.activeTab)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  // Persist state to localStorage (only after initial hydration)
  useEffect(() => {
    if (!hydrated) return
    const state = {
      description, category, titles, usedTitle, titleLanguage,
      logoPrompt, includeTitleInLogo, logoUrl, maskableUrl, coverUrl,
      seoTexts, catalogDescs, catalogDescHint, howToPlayTexts, howToPlayHint,
      onboardingScreens, onboardingTranslations,
      orientation, platform, framework, gameCodePath, yandexMetrika,
      testingChecklistPath, referenceScreenshots, localizations,
      keywords, activeTab,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [
    hydrated,
    description, category, titles, usedTitle, titleLanguage,
    logoPrompt, includeTitleInLogo, logoUrl, maskableUrl, coverUrl,
    seoTexts, catalogDescs, catalogDescHint, howToPlayTexts, howToPlayHint,
    onboardingScreens, onboardingTranslations,
    orientation, platform, framework, gameCodePath, yandexMetrika,
    testingChecklistPath, referenceScreenshots, localizations,
    keywords, activeTab,
  ])

  function startNewGeneration() {
    if (!confirm('This will clear all fields and start fresh. Continue?')) return
    localStorage.removeItem(STORAGE_KEY)
    setDescription('')
    setCategory('')
    setTitles([])
    setEditingIndex(null)
    setUsedTitle(null)
    setTitleLanguage('Russian')
    setLogoPrompt('')
    setIncludeTitleInLogo(false)
    setLogoUrl(null)
    setMaskableUrl(null)
    setCoverUrl(null)
    setSeoTexts({})
    setCatalogDescs({})
    setCatalogDescHint('')
    setHowToPlayTexts({})
    setHowToPlayHint('')
    setOnboardingScreens(DEFAULT_ONBOARDING)
    setOnboardingTranslations({})
    setOrientation('both')
    setPlatform('both')
    setFramework('React')
    setGameCodePath('')
    setYandexMetrika('')
    setTestingChecklistPath('')
    setReferenceScreenshots([])
    setLocalizations([])
    setKeywords([])
    setActiveTab('General')
  }

  async function generateTitles() {
    if (!description.trim()) return
    setTitlesLoading(true)
    setTitlesError(null)
    setTitles([])
    setEditingIndex(null)
    try {
      const res = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, category, language: titleLanguage }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTitles(data.titles || [])
    } catch (err) {
      setTitlesError(err.message)
    } finally {
      setTitlesLoading(false)
    }
  }

  function updateTitle(i, newText) {
    setTitles((prev) => prev.map((t, idx) => (idx === i ? newText : t)))
  }

  function toggleEdit(i) {
    setEditingIndex((prev) => (prev === i ? null : i))
  }

  function useThisTitle(i) {
    setUsedTitle(titles[i])
    setEditingIndex(null)
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/assets-status')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.logo?.exists) {
          setLogoUrl(`/logo.png?t=${data.logo.mtime}`)
        }
        if (data.maskable?.exists) {
          setMaskableUrl(`/maskable.png?t=${data.maskable.mtime}`)
        }
        if (data.cover?.exists) {
          setCoverUrl(`/cover.png?t=${data.cover.mtime}`)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function generateLogo() {
    const effectivePrompt = logoPrompt.trim() || description.trim()
    if (!effectivePrompt) return
    setLogoLoading(true)
    setLogoError(null)
    try {
      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, logoPrompt, titleText: includeTitleInLogo ? usedTitle : null }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // cache-bust so the browser reloads the new file
      setLogoUrl(`${data.path}?t=${data.savedAt}`)
    } catch (err) {
      setLogoError(err.message)
    } finally {
      setLogoLoading(false)
    }
  }

  async function generateMaskable() {
    setMaskableLoading(true)
    setMaskableError(null)
    try {
      const res = await fetch('/api/generate-maskable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMaskableUrl(`${data.path}?t=${data.savedAt}`)
    } catch (err) {
      setMaskableError(err.message)
    } finally {
      setMaskableLoading(false)
    }
  }

  async function generateCover() {
    if (!description.trim()) return
    setCoverLoading(true)
    setCoverError(null)
    try {
      const res = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCoverUrl(`${data.path}?t=${data.savedAt}`)
    } catch (err) {
      setCoverError(err.message)
    } finally {
      setCoverLoading(false)
    }
  }

  async function generateSeoRussian() {
    if (!description.trim()) return
    setSeoLoading(true)
    setSeoError(null)
    try {
      const res = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, language: 'Russian', category }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSeoTexts((prev) => ({ ...prev, Russian: data.seo || '' }))
    } catch (err) {
      setSeoError(err.message)
    } finally {
      setSeoLoading(false)
    }
  }

  async function translateSeoAll() {
    const source = seoTexts['Russian']
    if (!source?.trim()) return
    const otherLangs = localizations.filter((l) => l !== 'Russian')
    if (otherLangs.length === 0) return
    setSeoLoading(true)
    setSeoError(null)
    try {
      const results = await Promise.all(
        otherLangs.map(async (lang) => {
          const res = await fetch('/api/generate-seo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceText: source, language: lang }),
          })
          const data = await res.json()
          if (data.error) throw new Error(`${lang}: ${data.error}`)
          return [lang, data.seo || '']
        })
      )
      setSeoTexts((prev) => {
        const next = { ...prev }
        for (const [lang, text] of results) next[lang] = text
        return next
      })
    } catch (err) {
      setSeoError(err.message)
    } finally {
      setSeoLoading(false)
    }
  }

  function updateSeoText(lang, value) {
    setSeoTexts((prev) => ({ ...prev, [lang]: value }))
  }

  async function generateCatalogDescRussian() {
    if (!description.trim()) return
    setCatalogDescLoading(true)
    setCatalogDescError(null)
    try {
      const res = await fetch('/api/generate-catalog-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, language: 'Russian', hint: catalogDescHint, category }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCatalogDescs((prev) => ({ ...prev, Russian: data.catalogDescription || '' }))
    } catch (err) {
      setCatalogDescError(err.message)
    } finally {
      setCatalogDescLoading(false)
    }
  }

  async function translateCatalogDescAll() {
    const source = catalogDescs['Russian']
    if (!source?.trim()) return
    const otherLangs = localizations.filter((l) => l !== 'Russian')
    if (otherLangs.length === 0) return
    setCatalogDescLoading(true)
    setCatalogDescError(null)
    try {
      const results = await Promise.all(
        otherLangs.map(async (lang) => {
          const res = await fetch('/api/generate-catalog-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceText: source, language: lang }),
          })
          const data = await res.json()
          if (data.error) throw new Error(`${lang}: ${data.error}`)
          return [lang, data.catalogDescription || '']
        })
      )
      setCatalogDescs((prev) => {
        const next = { ...prev }
        for (const [lang, text] of results) next[lang] = text
        return next
      })
    } catch (err) {
      setCatalogDescError(err.message)
    } finally {
      setCatalogDescLoading(false)
    }
  }

  function updateCatalogDesc(lang, value) {
    setCatalogDescs((prev) => ({ ...prev, [lang]: value }))
  }

  async function generateHowToPlayRussian() {
    if (!description.trim()) return
    setHowToPlayLoading(true)
    setHowToPlayError(null)
    try {
      const res = await fetch('/api/generate-how-to-play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, language: 'Russian', hint: howToPlayHint, category }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setHowToPlayTexts((prev) => ({ ...prev, Russian: data.howToPlay || '' }))
    } catch (err) {
      setHowToPlayError(err.message)
    } finally {
      setHowToPlayLoading(false)
    }
  }

  async function translateHowToPlayAll() {
    const source = howToPlayTexts['Russian']
    if (!source?.trim()) return
    const otherLangs = localizations.filter((l) => l !== 'Russian')
    if (otherLangs.length === 0) return
    setHowToPlayLoading(true)
    setHowToPlayError(null)
    try {
      const results = await Promise.all(
        otherLangs.map(async (lang) => {
          const res = await fetch('/api/generate-how-to-play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceText: source, language: lang }),
          })
          const data = await res.json()
          if (data.error) throw new Error(`${lang}: ${data.error}`)
          return [lang, data.howToPlay || '']
        })
      )
      setHowToPlayTexts((prev) => {
        const next = { ...prev }
        for (const [lang, text] of results) next[lang] = text
        return next
      })
    } catch (err) {
      setHowToPlayError(err.message)
    } finally {
      setHowToPlayLoading(false)
    }
  }

  function updateHowToPlay(lang, value) {
    setHowToPlayTexts((prev) => ({ ...prev, [lang]: value }))
  }

  function toggleLocalization(lang) {
    setLocalizations((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  function addOnboardingScreen() {
    setOnboardingScreens((prev) => [...prev, { title: '', options: [''] }])
  }

  function removeOnboardingScreen(idx) {
    setOnboardingScreens((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateScreenTitle(idx, value) {
    setOnboardingScreens((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, title: value } : s))
    )
  }

  function updateScreenOption(screenIdx, optIdx, value) {
    setOnboardingScreens((prev) =>
      prev.map((s, i) =>
        i === screenIdx
          ? { ...s, options: s.options.map((o, j) => (j === optIdx ? value : o)) }
          : s
      )
    )
  }

  function addScreenOption(screenIdx) {
    setOnboardingScreens((prev) =>
      prev.map((s, i) =>
        i === screenIdx ? { ...s, options: [...s.options, ''] } : s
      )
    )
  }

  function removeScreenOption(screenIdx, optIdx) {
    setOnboardingScreens((prev) =>
      prev.map((s, i) =>
        i === screenIdx
          ? { ...s, options: s.options.filter((_, j) => j !== optIdx) }
          : s
      )
    )
  }

  async function translateOnboardingAll() {
    const otherLangs = localizations.filter((l) => l !== 'Russian')
    if (otherLangs.length === 0) return
    if (onboardingScreens.every((s) => !s.title.trim())) return
    setOnboardingTransLoading(true)
    setOnboardingTransError(null)
    try {
      const results = await Promise.all(
        otherLangs.map(async (lang) => {
          const res = await fetch('/api/translate-onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ screens: onboardingScreens, language: lang }),
          })
          const data = await res.json()
          if (data.error) throw new Error(`${lang}: ${data.error}`)
          return [lang, data.screens || []]
        })
      )
      setOnboardingTranslations((prev) => {
        const next = { ...prev }
        for (const [lang, screens] of results) next[lang] = screens
        return next
      })
    } catch (err) {
      setOnboardingTransError(err.message)
    } finally {
      setOnboardingTransLoading(false)
    }
  }

  function updateTranslatedScreenTitle(lang, screenIdx, value) {
    setOnboardingTranslations((prev) => ({
      ...prev,
      [lang]: (prev[lang] || []).map((s, i) =>
        i === screenIdx ? { ...s, title: value } : s
      ),
    }))
  }

  function updateTranslatedScreenOption(lang, screenIdx, optIdx, value) {
    setOnboardingTranslations((prev) => ({
      ...prev,
      [lang]: (prev[lang] || []).map((s, i) =>
        i === screenIdx
          ? { ...s, options: s.options.map((o, j) => (j === optIdx ? value : o)) }
          : s
      ),
    }))
  }

  async function generateKeywords() {
    if (!description.trim()) return
    setKeywordsLoading(true)
    setKeywordsError(null)
    setKeywords([])
    try {
      const res = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, category }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setKeywords(data.keywords || [])
    } catch (err) {
      setKeywordsError(err.message)
    } finally {
      setKeywordsLoading(false)
    }
  }

  const russianSeoFilled = !!seoTexts['Russian']?.trim()
  const russianCatalogDescFilled = !!catalogDescs['Russian']?.trim()
  const russianHowToPlayFilled = !!howToPlayTexts['Russian']?.trim()

  const missingFields = []
  if (!description.trim()) missingFields.push('Game Description')
  if (!category) missingFields.push('Category / Genre')
  if (keywords.length === 0) missingFields.push('Keywords')
  if (!usedTitle) missingFields.push('Game Title')
  if (!logoUrl) missingFields.push('Logo')
  if (!maskableUrl) missingFields.push('Maskable Icon')
  if (!coverUrl) missingFields.push('Catalog Cover')
  if (!framework) missingFields.push('Framework')
  if (!gameCodePath.trim()) missingFields.push('Game Code Path')
  if (localizations.length === 0) missingFields.push('Localization')
  if (!russianSeoFilled) missingFields.push('SEO Text (Russian)')
  if (!russianCatalogDescFilled) missingFields.push('About the game (Russian)')
  if (!russianHowToPlayFilled) missingFields.push('How to play (Russian)')

  const canExport = missingFields.length === 0

  function buildSpec() {
    const lines = []
    lines.push('# Game Specification')
    lines.push('')
    lines.push('## Meta')
    lines.push(`- **Title:** ${usedTitle}`)
    lines.push(`- **Category:** ${category}`)
    lines.push(`- **Screen Orientation:** the game should be playable in ${orientation} orientation`)
    lines.push(`- **Platforms:** the game should be available in ${platform} platforms`)
    lines.push(`- **Framework:** ${framework}`)
    lines.push(`- **Game Code Path:** Use this reference game code and edit it: \`${gameCodePath.trim()}\``)
    if (yandexMetrika.trim()) {
      lines.push(`- **Yandex Metrika Counter ID:** ${yandexMetrika.trim()}`)
    }
    if (testingChecklistPath.trim()) {
      lines.push(`- **Testing Checklist:** \`${testingChecklistPath.trim()}\``)
    }
    lines.push('')

    lines.push('## Game Description')
    lines.push(description.trim())
    lines.push('')

    lines.push('## Keywords')
    lines.push(keywords.join(', '))
    lines.push('')

    lines.push('## Onboarding Screens')
    lines.push('Change the existing onboarding screens with these if they differ in reference code:')
    lines.push('')
    lines.push('### Russian (source)')
    onboardingScreens.forEach((screen, i) => {
      lines.push(`#### Screen ${i + 1}`)
      lines.push(`**Question:** ${screen.title}`)
      lines.push('')
      screen.options.forEach((opt, j) => {
        lines.push(`${j + 1}. ${opt}`)
      })
      lines.push('')
    })

    for (const lang of localizations.filter((l) => l !== 'Russian')) {
      const translated = onboardingTranslations[lang]
      if (translated && translated.length > 0) {
        lines.push(`### ${lang}`)
        translated.forEach((screen, i) => {
          lines.push(`#### Screen ${i + 1}`)
          lines.push(`**Question:** ${screen.title}`)
          lines.push('')
          screen.options.forEach((opt, j) => {
            lines.push(`${j + 1}. ${opt}`)
          })
          lines.push('')
        })
      }
    }

    lines.push('## Assets')
    lines.push('- Logo: `./public/logo.png`')
    lines.push('- Maskable Icon: `./public/maskable.png`')
    lines.push('- Catalog Cover: `./public/cover.png`')
    if (referenceScreenshots.length > 0) {
      lines.push('')
      lines.push('### Reference Screenshots')
      lines.push('Take these screenshots of other game as reference for the style and color pallete ')
      referenceScreenshots.forEach((s, i) => {
        lines.push(`- ${i + 1}. \`./public${s.serverPath || '/reference-screenshots/' + s.name}\``)
      })
    }
    lines.push('')

    lines.push('## Localization')
    lines.push(`The game should be localized (i18n) in these languages: ${localizations.join(', ')}`)
    lines.push('')

    for (const lang of localizations) {
      lines.push(`### ${lang}`)
      lines.push('')
      lines.push('#### SEO Text')
      lines.push(seoTexts[lang]?.trim() || '_(not provided)_')
      lines.push('')
      lines.push('#### About the game')
      lines.push(catalogDescs[lang]?.trim() || '_(not provided)_')
      lines.push('')
      lines.push('#### How to play')
      lines.push(howToPlayTexts[lang]?.trim() || '_(not provided)_')
      lines.push('')
    }

    lines.push('---')
    lines.push('')
    lines.push('## Instructions for Claude')
    lines.push('')
    lines.push('You are given a reference game codebase in the folder defined in "Game Code Path". Update it to match the specification above:')
    lines.push('')
    if (testingChecklistPath.trim()) {
      lines.push(`0. Read the testing checklist at \`${testingChecklistPath.trim()}\` and follow all checks and instructions when generating and verifying the game.`)
    }
    lines.push('1. Set the game title, description, and metadata in the appropriate config / manifest files.')
    lines.push('2. Wire up the Yandex Games SDK — use the orientation, platform, and metrika counter values.')
    lines.push('3. Place the provided assets (logo, maskable icon, cover) in the correct locations.')
    lines.push('4. Implement i18n localization for all listed languages (localize all game strings, necessary assets, button texts, messages, onboarding screens, etc.).')
    lines.push('5. Implement the onboarding screens as described — each screen has a question title and selectable options.')
    lines.push('6. If reference screenshots are listed, READ each image file using the Read tool to view them. Analyze the color palette, art style, UI layout, and design patterns. Apply these as visual style guidance for any generated UI, theme colors, and overall aesthetic.')
    lines.push('7. Use the specified framework for the implementation.')

    lines.push('')

    return lines.join('\n')
  }

  const [exportLoading, setExportLoading] = useState(false)
  const [exportResult, setExportResult] = useState(null)

  async function exportConfig() {
    if (!canExport) return
    setExportLoading(true)
    setExportResult(null)
    try {
      const spec = buildSpec()
      const res = await fetch('/api/export-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec, gameCodePath: gameCodePath.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setExportResult({ success: true, path: data.path })
    } catch (err) {
      setExportResult({ success: false, error: err.message })
    } finally {
      setExportLoading(false)
    }
  }

  async function generateGame() {
    if (!canExport || gameRunning) return
    const spec = buildSpec()
    const sid = `session-${Date.now()}`
    setGameSessionId(sid)
    setGameRunning(true)
    setGameLogs([{ type: 'system', text: aiProvider === 'opencode' ? 'Starting OpenCode session...' : 'Starting Claude Code session...' }])

    try {
      const res = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec, gameCodePath: gameCodePath.trim(), sessionId: sid, provider: aiProvider }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const evt = JSON.parse(line.slice(6))
            if (evt.type === 'output') {
              // Parse stream-json lines from Claude
              const jsonLines = evt.data.split('\n').filter(Boolean)
              for (const jl of jsonLines) {
                try {
                  const msg = JSON.parse(jl)
                  if (msg.type === 'assistant' && msg.message?.content) {
                    for (const block of msg.message.content) {
                      if (block.type === 'text' && block.text) {
                        setGameLogs((prev) => [...prev, { type: 'assistant', text: block.text }])
                      } else if (block.type === 'tool_use') {
                        setGameLogs((prev) => [...prev, {
                          type: 'tool',
                          text: `[${block.name}] ${JSON.stringify(block.input).slice(0, 200)}`,
                        }])
                      }
                    }
                  } else if (msg.type === 'result') {
                    const resultText = typeof msg.result === 'string'
                      ? msg.result
                      : msg.result?.content?.map((b) => b.text).filter(Boolean).join('\n') || JSON.stringify(msg.result)
                    setGameLogs((prev) => [...prev, { type: 'assistant', text: resultText }])
                  }
                } catch {
                  // raw text fallback
                  if (jl.trim()) {
                    setGameLogs((prev) => [...prev, { type: 'raw', text: jl }])
                  }
                }
              }
            } else if (evt.type === 'stderr') {
              setGameLogs((prev) => [...prev, { type: 'stderr', text: evt.data }])
            } else if (evt.type === 'done') {
              setGameLogs((prev) => [...prev, {
                type: 'system',
                text: `Claude Code session finished (exit code: ${evt.code})`,
              }])
            } else if (evt.type === 'error') {
              setGameLogs((prev) => [...prev, { type: 'error', text: evt.data }])
            }
          } catch {
            // ignore parse errors for partial data
          }
        }
      }
    } catch (err) {
      setGameLogs((prev) => [...prev, { type: 'error', text: err.message }])
    } finally {
      setGameRunning(false)
      setGameSessionId(null)
    }
  }

  async function sendReply() {
    if (!gameReply.trim() || !gameSessionId) return
    const message = gameReply.trim()
    setGameLogs((prev) => [...prev, { type: 'user', text: message }])
    setGameReply('')
    try {
      await fetch('/api/generate-game/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: gameSessionId, message }),
      })
    } catch (err) {
      setGameLogs((prev) => [...prev, { type: 'error', text: `Reply failed: ${err.message}` }])
    }
  }

  async function stopGame() {
    if (!gameSessionId) return
    try {
      await fetch('/api/generate-game/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: gameSessionId }),
      })
      setGameLogs((prev) => [...prev, { type: 'system', text: 'Session stopped by user.' }])
    } catch (err) {
      setGameLogs((prev) => [...prev, { type: 'error', text: `Stop failed: ${err.message}` }])
    }
  }

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [gameLogs])

  const tabIndex = TABS.indexOf(activeTab)
  const hasPrev = tabIndex > 0
  const hasNext = tabIndex < TABS.length - 1

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">Yandex Game Generator</h1>
        <button className="btn btn-ghost" onClick={startNewGeneration}>
          New generation
        </button>
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (<>

      <section className="section">
        <label className="label" htmlFor="description">Game Description</label>
        <textarea
          id="description"
          className="textarea"
          rows={5}
          placeholder="Describe your game idea — genre, mechanics, setting, target audience..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </section>

      <section className="section">
        <h2 className="section-title">Category / Genre</h2>
        <div className="select-row">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`chip ${category === cat ? 'chip-active' : ''}`}
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={() => setCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Localization</h2>
        <p className="label">
          Select the languages your game will be localized in. SEO text will
          be generated in each selected language.
        </p>
        <div className="select-row">
          {LOCALIZATIONS.map((lang) => (
            <label
              key={lang}
              className={`chip ${localizations.includes(lang) ? 'chip-active' : ''}`}
            >
              <input
                type="checkbox"
                checked={localizations.includes(lang)}
                onChange={() => toggleLocalization(lang)}
              />
              {lang}
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">About the game</h2>
        <p className="label">
          Displayed on the game page. Up to 1000 characters per language.
          Explain the plot or gameplay in detail — main modes, features, and
          mechanics (e.g. co-op, PVP). One field is generated per selected
          language.
        </p>

        <label className="label" htmlFor="catalog-desc-hint">
          Additional instructions (optional)
        </label>
        <textarea
          id="catalog-desc-hint"
          className="textarea"
          rows={2}
          placeholder="e.g. Emphasize the co-op mode, mention seasonal events..."
          value={catalogDescHint}
          onChange={(e) => setCatalogDescHint(e.target.value)}
        />

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateCatalogDescRussian}
            disabled={catalogDescLoading || !description.trim()}
          >
            {catalogDescLoading ? 'Generating...' : 'Generate Russian'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={translateCatalogDescAll}
            disabled={catalogDescLoading || !catalogDescs['Russian']?.trim() || localizations.filter((l) => l !== 'Russian').length === 0}
          >
            Translate to all languages
          </button>
        </div>

        {!catalogDescs['Russian']?.trim() && (
          <p className="label">Generate the Russian version first, edit if needed, then translate.</p>
        )}

        {catalogDescError && <p className="error">{catalogDescError}</p>}

        {localizations.map((lang) => {
          const text = catalogDescs[lang] || ''
          return (
            <div key={lang} className="seo-lang-block">
              <label className="label" htmlFor={`catalog-desc-${lang}`}>
                {lang}
              </label>
              <textarea
                id={`catalog-desc-${lang}`}
                className="textarea"
                rows={6}
                maxLength={1000}
                placeholder={`Catalog description in ${lang}…`}
                value={text}
                onChange={(e) => updateCatalogDesc(lang, e.target.value)}
              />
              <p className="label">{text.length} / 1000</p>
            </div>
          )
        })}
      </section>

      <section className="section">
        <h2 className="section-title">How to play</h2>
        <p className="label">
          Instructions for players. Up to 1000 characters per language.
          Explain controls, objectives, and rules a new player needs to know.
          One field is generated per selected language.
        </p>

        <label className="label" htmlFor="how-to-play-hint">
          Additional instructions (optional)
        </label>
        <textarea
          id="how-to-play-hint"
          className="textarea"
          rows={2}
          placeholder="e.g. Mention swipe controls for mobile, describe power-ups..."
          value={howToPlayHint}
          onChange={(e) => setHowToPlayHint(e.target.value)}
        />

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateHowToPlayRussian}
            disabled={howToPlayLoading || !description.trim()}
          >
            {howToPlayLoading ? 'Generating...' : 'Generate Russian'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={translateHowToPlayAll}
            disabled={howToPlayLoading || !howToPlayTexts['Russian']?.trim() || localizations.filter((l) => l !== 'Russian').length === 0}
          >
            Translate to all languages
          </button>
        </div>

        {!howToPlayTexts['Russian']?.trim() && (
          <p className="label">Generate the Russian version first, edit if needed, then translate.</p>
        )}

        {howToPlayError && <p className="error">{howToPlayError}</p>}

        {localizations.map((lang) => {
          const text = howToPlayTexts[lang] || ''
          return (
            <div key={lang} className="seo-lang-block">
              <label className="label" htmlFor={`how-to-play-${lang}`}>
                {lang}
              </label>
              <textarea
                id={`how-to-play-${lang}`}
                className="textarea"
                rows={6}
                maxLength={1000}
                placeholder={`How to play in ${lang}…`}
                value={text}
                onChange={(e) => updateHowToPlay(lang, e.target.value)}
              />
              <p className="label">{text.length} / 1000</p>
            </div>
          )
        })}
      </section>

      <section className="section">
        <h2 className="section-title">SEO Text</h2>
        <p className="label">
          Game description for search results — visible under the game title
          in search engines. Up to 160 characters per language. Include genre,
          plot essence, or setting. One field is generated per selected
          language.
        </p>

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateSeoRussian}
            disabled={seoLoading || !description.trim()}
          >
            {seoLoading ? 'Generating...' : 'Generate Russian'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={translateSeoAll}
            disabled={seoLoading || !seoTexts['Russian']?.trim() || localizations.filter((l) => l !== 'Russian').length === 0}
          >
            Translate to all languages
          </button>
        </div>

        {!seoTexts['Russian']?.trim() && (
          <p className="label">Generate the Russian version first, edit if needed, then translate.</p>
        )}

        {seoError && <p className="error">{seoError}</p>}

        {localizations.map((lang) => {
          const text = seoTexts[lang] || ''
          return (
            <div key={lang} className="seo-lang-block">
              <label className="label" htmlFor={`seo-${lang}`}>
                {lang}
              </label>
              <textarea
                id={`seo-${lang}`}
                className="textarea"
                rows={3}
                maxLength={160}
                placeholder={`SEO description in ${lang}…`}
                value={text}
                onChange={(e) => updateSeoText(lang, e.target.value)}
              />
              <p className="label">{text.length} / 160</p>
            </div>
          )
        })}
      </section>

      <section className="section">
        <h2 className="section-title">Keywords</h2>
        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateKeywords}
            disabled={keywordsLoading || !description.trim()}
          >
            {keywordsLoading ? 'Generating...' : 'Generate Keywords'}
          </button>
        </div>

        {keywordsError && <p className="error">{keywordsError}</p>}

        {keywords.length > 0 && (
          <div className="keywords-wrap">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="keyword-tag keyword-tag-removable"
                onClick={() => setKeywords((prev) => prev.filter((_, idx) => idx !== i))}
              >
                {kw} <span className="keyword-remove">x</span>
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Game Title</h2>

        {usedTitle && (
          <div className="used-title">
            <span className="used-title-label">Selected title:</span>
            <strong>{usedTitle}</strong>
          </div>
        )}

        <div className="select-row">
          {['Russian', 'English'].map((lang) => (
            <label key={lang} className={`chip ${titleLanguage === lang ? 'chip-active' : ''}`}>
              <input
                type="radio"
                name="titleLanguage"
                value={lang}
                checked={titleLanguage === lang}
                onChange={() => setTitleLanguage(lang)}
              />
              {lang}
            </label>
          ))}
        </div>

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateTitles}
            disabled={titlesLoading || !description.trim()}
          >
            {titlesLoading ? 'Generating...' : 'Generate Game Title'}
          </button>

          {titles.length > 0 && (
            <button
              className="btn btn-ghost"
              onClick={generateTitles}
              disabled={titlesLoading}
            >
              Generate new variants
            </button>
          )}
        </div>

        {titlesError && <p className="error">{titlesError}</p>}

        {titles.length > 0 && (
          <ul className="titles-list">
            {titles.map((title, i) => (
              <li key={i} className="title-item">
                {editingIndex === i ? (
                  <input
                    className="title-edit-input"
                    value={title}
                    onChange={(e) => updateTitle(i, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="title-text">{title}</span>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => toggleEdit(i)}
                >
                  {editingIndex === i ? 'Done' : 'Edit'}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => useThisTitle(i)}
                >
                  Use this title
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Logo</h2>
        <label className="label" htmlFor="logo-prompt">
          Logo description (optional — game description will be used if empty)
        </label>
        <textarea
          id="logo-prompt"
          className="textarea"
          rows={3}
          placeholder="e.g. minimalist fox mascot, orange and purple palette, flat style..."
          value={logoPrompt}
          onChange={(e) => setLogoPrompt(e.target.value)}
        />

        <label className="label">Game title in the logo</label>
        <div className="select-row">
          {['Yes', 'No'].map((opt) => (
            <label key={opt} className={`chip ${(opt === 'Yes') === includeTitleInLogo ? 'chip-active' : ''}`}>
              <input
                type="radio"
                name="includeTitleInLogo"
                value={opt}
                checked={(opt === 'Yes') === includeTitleInLogo}
                onChange={() => setIncludeTitleInLogo(opt === 'Yes')}
              />
              {opt}
            </label>
          ))}
        </div>
        {includeTitleInLogo && !usedTitle && (
          <p className="label">Select a game title first to include it in the logo.</p>
        )}

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateLogo}
            disabled={logoLoading || (!description.trim() && !logoPrompt.trim()) || (includeTitleInLogo && !usedTitle)}
          >
            {logoLoading ? 'Generating...' : logoUrl ? 'Regenerate Logo' : 'Generate Logo'}
          </button>
        </div>

        {logoError && <p className="error">{logoError}</p>}

        {logoUrl && (
          <div className="logo-preview">
            <img src={logoUrl} alt="Generated game logo" />
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Maskable Icon</h2>
        <p className="label">
          Generates a maskable icon from the current logo (yellow background,
          centered with safe-zone padding).
        </p>

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateMaskable}
            disabled={maskableLoading || !logoUrl}
          >
            {maskableLoading ? 'Generating...' : 'Generate Maskable Icon'}
          </button>
        </div>

        {!logoUrl && (
          <p className="label">Generate a logo first to enable this.</p>
        )}

        {maskableError && <p className="error">{maskableError}</p>}

        {maskableUrl && (
          <div className="logo-preview">
            <img src={maskableUrl} alt="Generated maskable icon" />
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Catalog Cover</h2>
        <p className="label">
          Generates an 800×470 cover for the Yandex Games catalog. Uses the
          game description for the background (logo-conditioned style) and
          overlays the unmodified logo in the center.
        </p>

        <div className="row">
          <button
            className="btn btn-primary"
            onClick={generateCover}
            disabled={coverLoading || !logoUrl || !description.trim()}
          >
            {coverLoading ? 'Generating...' : coverUrl ? 'Regenerate Cover' : 'Generate Cover'}
          </button>
        </div>

        {!logoUrl && (
          <p className="label">Generate a logo first to enable this.</p>
        )}

        {coverError && <p className="error">{coverError}</p>}

        {coverUrl && (
          <div className="logo-preview">
            <img src={coverUrl} alt="Generated catalog cover" />
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Reference Screenshots</h2>
        <p className="label">
          Upload screenshots of other games as visual reference for colors,
          theme, and art style. These will be included in the exported spec.
        </p>

        <div className="row">
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            Upload Screenshots
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={async (e) => {
                const files = Array.from(e.target.files || [])
                e.target.value = ''
                for (const file of files) {
                  const form = new FormData()
                  form.append('file', file)
                  try {
                    const res = await fetch('/api/upload-screenshot', {
                      method: 'POST',
                      body: form,
                    })
                    const data = await res.json()
                    if (data.error) continue
                    setReferenceScreenshots((prev) => [...prev, {
                      name: data.name,
                      url: `${data.path}?t=${Date.now()}`,
                      serverPath: data.path,
                    }])
                  } catch {
                    // skip failed uploads
                  }
                }
              }}
            />
          </label>
        </div>

        {referenceScreenshots.length > 0 && (
          <div className="screenshots-grid">
            {referenceScreenshots.map((item, i) => (
              <div key={i} className="screenshot-item">
                <img src={item.url} alt={item.name} />
                <button
                  className="btn btn-ghost btn-sm screenshot-remove"
                  onClick={() =>
                    setReferenceScreenshots((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Onboarding Screens</h2>
        <p className="label">
          Configure the onboarding survey screens shown to new players.
        </p>

        {onboardingScreens.map((screen, sIdx) => (
          <div key={sIdx} className="onboarding-screen">
            <div className="onboarding-screen-header">
              <span className="label">Screen {sIdx + 1}</span>
              {onboardingScreens.length > 1 && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeOnboardingScreen(sIdx)}
                >
                  Remove
                </button>
              )}
            </div>

            <label className="label">Question title</label>
            <input
              className="title-edit-input"
              type="text"
              placeholder="e.g. Как много времени у вас на игру?"
              value={screen.title}
              onChange={(e) => updateScreenTitle(sIdx, e.target.value)}
            />

            <label className="label">Options / Answers</label>
            {screen.options.map((opt, oIdx) => (
              <div key={oIdx} className="onboarding-option-row">
                <span className="onboarding-option-num">{oIdx + 1}.</span>
                <input
                  className="title-edit-input"
                  type="text"
                  placeholder={`Option ${oIdx + 1}`}
                  value={opt}
                  onChange={(e) => updateScreenOption(sIdx, oIdx, e.target.value)}
                />
                {screen.options.length > 1 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeScreenOption(sIdx, oIdx)}
                  >
                    x
                  </button>
                )}
              </div>
            ))}

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => addScreenOption(sIdx)}
            >
              + Add option
            </button>
          </div>
        ))}

        <div className="row">
          <button
            className="btn btn-secondary"
            onClick={addOnboardingScreen}
          >
            + Add Screen
          </button>
          <button
            className="btn btn-secondary"
            onClick={translateOnboardingAll}
            disabled={onboardingTransLoading || onboardingScreens.every((s) => !s.title.trim()) || localizations.filter((l) => l !== 'Russian').length === 0}
          >
            {onboardingTransLoading ? 'Translating...' : 'Translate to all languages'}
          </button>
        </div>

        {onboardingTransError && <p className="error">{onboardingTransError}</p>}

        {localizations.filter((l) => l !== 'Russian').map((lang) => {
          const translated = onboardingTranslations[lang]
          if (!translated || translated.length === 0) return null
          return (
            <div key={lang} className="onboarding-translation-block">
              <h3 className="label" style={{ fontWeight: 600, fontSize: 15 }}>{lang}</h3>
              {translated.map((screen, sIdx) => (
                <div key={sIdx} className="onboarding-screen">
                  <span className="label">Screen {sIdx + 1}</span>
                  <input
                    className="title-edit-input"
                    type="text"
                    value={screen.title}
                    onChange={(e) => updateTranslatedScreenTitle(lang, sIdx, e.target.value)}
                  />
                  {screen.options.map((opt, oIdx) => (
                    <div key={oIdx} className="onboarding-option-row">
                      <span className="onboarding-option-num">{oIdx + 1}.</span>
                      <input
                        className="title-edit-input"
                        type="text"
                        value={opt}
                        onChange={(e) => updateTranslatedScreenOption(lang, sIdx, oIdx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        })}
      </section>

      </>)}

      {activeTab === 'Technical' && (<>

      <section className="section">
        <h2 className="section-title">Orientation</h2>
        <div className="select-row">
          {['album', 'portrait', 'album AND portrait'].map((opt) => (
            <label key={opt} className={`chip ${orientation === opt ? 'chip-active' : ''}`}>
              <input
                type="radio"
                name="orientation"
                value={opt}
                checked={orientation === opt}
                onChange={() => setOrientation(opt)}
              />
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Platforms</h2>
        <div className="select-row">
          {['mobile', 'desktop', 'mobile AND desktop'].map((opt) => (
            <label key={opt} className={`chip ${platform === opt ? 'chip-active' : ''}`}>
              <input
                type="radio"
                name="platform"
                value={opt}
                checked={platform === opt}
                onChange={() => setPlatform(opt)}
              />
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Framework</h2>
        <div className="select-row">
          {['React', 'Babylon', 'Phaser'].map((opt) => (
            <label key={opt} className={`chip ${framework === opt ? 'chip-active' : ''}`}>
              <input
                type="radio"
                name="framework"
                value={opt}
                checked={framework === opt}
                onChange={() => setFramework(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Yandex Metrika Counter</h2>
        <label className="label" htmlFor="yandex-metrika">
          Counter ID
        </label>
        <input
          id="yandex-metrika"
          className="title-edit-input"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 12345678"
          value={yandexMetrika}
          onChange={(e) => setYandexMetrika(e.target.value)}
        />
      </section>

      <section className="section">
        <h2 className="section-title">Reference game code path</h2>
        <p className="label">
          Path to the existing game codebase folder. This will be used to
          update the code with the gathered descriptions and requirements.
        </p>
        <input
          id="game-code-path"
          className="title-edit-input"
          type="text"
          placeholder="e.g. D:\dev\my-game"
          value={gameCodePath}
          onChange={(e) => setGameCodePath(e.target.value)}
        />
      </section>

      <section className="section">
        <h2 className="section-title">Testing Checklist</h2>
        <p className="label">
          Path to a testing checklist (.md file) with checks and instructions
          that should be followed when generating and verifying the game.
        </p>
        <input
          id="testing-checklist-path"
          className="title-edit-input"
          type="text"
          placeholder="e.g. D:\dev\testing-checklist.md"
          value={testingChecklistPath}
          onChange={(e) => setTestingChecklistPath(e.target.value)}
        />
      </section>

      <section className="section export-section">
        <h2 className="section-title">Export Configuration</h2>
        <p className="label">
          Saves GAME_SPEC.md to the game code folder specified above.
        </p>

        {!canExport && (
          <div className="missing-fields">
            <p className="label">Missing fields:</p>
            <ul className="missing-list">
              {missingFields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="row">
          <button
            className="btn btn-export"
            onClick={exportConfig}
            disabled={!canExport || exportLoading}
          >
            {exportLoading ? 'Saving...' : 'Export Configuration'}
          </button>
        </div>

        {exportResult && exportResult.success && (
          <p className="used-title" style={{ fontSize: 13 }}>
            Saved to {exportResult.path}
          </p>
        )}
        {exportResult && !exportResult.success && (
          <p className="error">{exportResult.error}</p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Generate Game</h2>
        <p className="label">
          Runs Claude Code in the game folder to update the codebase based on
          all the gathered configuration. You can interact with Claude if it
          needs your input.
        </p>

        <div className="row" style={{ marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="aiProvider"
              value="claude-cli"
              checked={aiProvider === 'claude-cli'}
              onChange={() => setAiProvider('claude-cli')}
              disabled={gameRunning}
            />
            Claude agent
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="aiProvider"
              value="opencode"
              checked={aiProvider === 'opencode'}
              onChange={() => setAiProvider('opencode')}
              disabled={gameRunning}
            />
            OpenCode local model
          </label>
        </div>

        <div className="row">
          <button
            className="btn btn-export"
            onClick={generateGame}
            disabled={!canExport || gameRunning}
          >
            {gameRunning ? 'Running...' : 'Generate Game'}
          </button>
          {gameRunning && (
            <button
              className="btn btn-stop"
              onClick={stopGame}
            >
              Stop
            </button>
          )}
        </div>

        {!canExport && !gameRunning && (
          <p className="label">Fill in all required fields to enable this.</p>
        )}

        {gameLogs.length > 0 && (
          <div className="game-logs">
            {gameLogs.map((log, i) => (
              <div key={i} className={`game-log game-log-${log.type}`}>
                {log.type === 'user' && <span className="game-log-prefix">You: </span>}
                {log.type === 'assistant' && <span className="game-log-prefix">{aiProvider === 'opencode' ? 'OpenCode' : 'Claude'}: </span>}
                {log.type === 'tool' && <span className="game-log-prefix">Tool: </span>}
                {log.type === 'system' && <span className="game-log-prefix">System: </span>}
                {log.type === 'error' && <span className="game-log-prefix">Error: </span>}
                <span>{log.text}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}

        {gameRunning && (
          <div className="game-reply-row">
            <input
              className="title-edit-input"
              type="text"
              placeholder="Reply to Claude..."
              value={gameReply}
              onChange={(e) => setGameReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendReply()
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={sendReply}
              disabled={!gameReply.trim()}
            >
              Send
            </button>
          </div>
        )}
      </section>

      </>)}

      <div className="tab-nav">
        {hasPrev && (
          <button
            className="btn btn-secondary"
            onClick={() => setActiveTab(TABS[tabIndex - 1])}
          >
            Previous
          </button>
        )}
        <div style={{ flex: 1 }} />
        {hasNext && (
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab(TABS[tabIndex + 1])}
          >
            Next
          </button>
        )}
      </div>

    </div>
  )
}
