import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { GenerateScenesRequest, GenerateScenesResponse } from '@/types'

const getOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    apiKey: apiKey,
  })
}

const SYSTEM_PROMPT = `You are a storyboard assistant for explainer videos. Analyze the provided script and break it into visual scenes suitable for a video storyboard.

Requirements:
1. Split script at natural sentence or thought boundaries (not mid-sentence)
2. Each scene should be 1-3 sentences max
3. Extract 2-3 visual keywords per scene that represent key concepts
4. Suggest appropriate icon names from Lucide or Heroicons libraries
5. Choose animation type (fade/slide/zoom/bounce) based on scene energy and mood:
   - fade: Calm, informational, medical content
   - slide: Sequential steps, processes, narratives
   - zoom: Emphasis, important facts, calls-to-action
   - bounce: Playful, energetic, positive messaging
6. Limit to maximum 20 scenes for scripts under 500 words
7. Default duration is 5 seconds per scene

Available icon examples from Lucide: heart, pill, calendar, clock, money, users, phone, mail, shield, check, x, plus, minus, arrow-right, arrow-left, chevron-up, chevron-down, settings, home, search, filter, edit, trash, download, upload, image, video, file, folder, star, bookmark, bell, message-circle, send, share, eye, lock, unlock, key, database, server, globe, wifi, bluetooth, battery, zap, sun, moon, cloud, droplet, flame, leaf, flower, tree, mountain, umbrella, briefcase, shopping-cart, credit-card, dollar-sign, trending-up, trending-down, bar-chart, pie-chart, activity, clipboard, book, bookmark, coffee, gift, map-pin, navigation, compass, map, plane, car, bike, truck, train, bus, rocket, cpu, hard-drive, terminal, code, git-branch, package, box, archive, layers, layout, grid, list, columns, sidebar, maximize, minimize, zoom-in, zoom-out, refresh, rotate-cw, rotate-ccw, volume, volume-x, mic, mic-off, camera, camera-off, video-icon, play, pause, stop, skip-forward, skip-back, repeat, shuffle, monitor, smartphone, tablet, watch, printer, mouse, keyboard, headphones, speaker, radio, tv, gamepad, joystick, puzzle, target, award, trophy, medal, flag, thumbs-up, thumbs-down, smile, frown, meh, laugh, angry, sad, alert-triangle, alert-circle, alert-octagon, info, help-circle, question-mark-circle, x-circle, check-circle, plus-circle, minus-circle, slash, hash, at-sign, percent, dollar, euro, pound, yen, ruble, franc

Available icon examples from Heroicons: academic-cap, adjustments, annotation, archive, arrow-circle-down, arrow-circle-left, arrow-circle-right, arrow-circle-up, arrow-down, arrow-left, arrow-narrow-down, arrow-narrow-left, arrow-narrow-right, arrow-narrow-up, arrow-right, arrow-up, arrows-expand, at-symbol, backspace, badge-check, ban, beaker, bell, book-open, bookmark-alt, briefcase, cake, calculator, calendar, camera, cash, chart-bar, chart-pie, chart-square-bar, chat-alt, chat, check-circle, check, chevron-double-down, chevron-double-left, chevron-double-right, chevron-double-up, chevron-down, chevron-left, chevron-right, chevron-up, chip, clipboard-check, clipboard-copy, clipboard-list, clipboard, clock, cloud-download, cloud-upload, cloud, code, cog, collection, color-swatch, credit-card, cube-transparent, cube, currency-dollar, currency-euro, currency-pound, currency-rupee, currency-yen, cursor-click, database, desktop-computer, device-mobile, device-tablet, document-add, document-download, document-duplicate, document-remove, document-report, document-search, document-text, document, dots-circle-horizontal, dots-horizontal, dots-vertical, download, duplicate, emoji-happy, emoji-sad, exclamation-circle, exclamation, external-link, eye-off, eye, fast-forward, film, filter, fingerprint, fire, flag, folder-add, folder-download, folder-open, folder-remove, folder, gift, globe-alt, globe, hand, hashtag, heart, home, identification, inbox-in, inbox, information-circle, key, library, light-bulb, lightning-bolt, link, location-marker, lock-closed, lock-open, login, logout, mail-open, mail, map, menu-alt-1, menu-alt-2, menu-alt-3, menu-alt-4, menu, microphone, minus-circle, minus, moon, music-note, newspaper, office-building, paper-airplane, paper-clip, pause, pencil-alt, pencil, phone-incoming, phone-missed-call, phone-outgoing, phone, photograph, play, plus-circle, plus, presentation-chart-bar, presentation-chart-line, printer, puzzle, qrcode, question-mark-circle, receipt-refund, receipt-tax, refresh, reply, rewind, rss, save-as, save, scale, scissors, search-circle, search, selector, server, share, shield-check, shield-exclamation, shopping-bag, shopping-cart, sort-ascending, sort-descending, sparkles, speakerphone, star, status-offline, status-online, stop, sun, support, switch-horizontal, switch-vertical, table, tag, template, terminal, thumb-down, thumb-up, ticket, translate, trash, trending-down, trending-up, truck, upload, user-add, user-circle, user-group, user-remove, user, users, variable, video-camera, view-boards, view-grid-add, view-grid, view-list, volume-off, volume-up, wifi, x-circle, x, zoom-in, zoom-out

Output format: JSON array with structure:
{
  "scenes": [
    {
      "text": "Scene text here",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "suggestedIcons": [
        { "library": "lucide", "name": "heart" },
        { "library": "heroicons", "name": "heart" },
        { "library": "lucide", "name": "activity" }
      ],
      "animation": "fade",
      "duration": 5
    }
  ]
}`

export async function POST(request: NextRequest) {
  try {
    const body: GenerateScenesRequest = await request.json()
    const { script, maxScenes = 20 } = body

    if (!script || script.trim().length < 10) {
      return NextResponse.json(
        { error: 'Script is too short or empty' },
        { status: 400 }
      )
    }

    // Get API key from header
    const apiKey = request.headers.get('X-API-Key')
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Valid OpenAI API key required' },
        { status: 401 }
      )
    }

    const openai = getOpenAIClient(apiKey)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Script: ${script}\n\nBreak this into visual scenes for an explainer video storyboard. Maximum ${maxScenes} scenes.` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const parsedResponse: GenerateScenesResponse = JSON.parse(responseText)

    // Validate and sanitize response
    if (!parsedResponse.scenes || !Array.isArray(parsedResponse.scenes)) {
      throw new Error('Invalid response format from AI')
    }

    // Limit scenes to maxScenes
    parsedResponse.scenes = parsedResponse.scenes.slice(0, maxScenes)

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error('Scene generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate scenes. Please try again.' },
      { status: 500 }
    )
  }
}
