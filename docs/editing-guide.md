# Content Editing Guide

This guide shows exactly which files to edit for text, images, and SEO on the Doggzy website.

## Quick Reference

| What you want to change | File to edit |
|--------------------------|--------------|
| Page content (text, hero sections, CTAs) | `src/content/pages/*.json` |
| Navigation menu items | `src/config/navigation.ts` |
| SEO titles and descriptions | `src/config/seo.ts` |
| Translations | `src/i18n/*.json` |
| Images and videos | `public/images/` and `public/videos/` |
| Footer content | `src/components/footer.tsx` |

## Page Content

All page content is stored in JSON files in `src/content/pages/`. Each page has its own file:

### Home Page
**File:** `src/content/pages/home.json`

```json
{
  "hero": {
    "title": "Every Dog Deserves",
    "titleHighlight": "A Happy Ending",
    "subtitle": "Join our global movement to rescue...",
    "primaryCta": {
      "label": "Donate Now",
      "href": "/donate"
    }
  }
}
```

### Other Pages
- **Adopt:** `src/content/pages/adopt.json`
- **Foster:** `src/content/pages/foster.json`
- **Donate:** `src/content/pages/donate.json`
- **Shop:** `src/content/pages/shop.json`
- **About:** `src/content/pages/about.json`

## Navigation Menu

**File:** `src/config/navigation.ts`

To add/remove menu items or change order:

```typescript
export const mainNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Adopt', href: '/adopt' },
  // Add your new item here
  { label: 'New Page', href: '/new-page' }
]
```

## SEO Settings

**File:** `src/config/seo.ts`

To change page titles, descriptions, or keywords:

```typescript
export const seoPages: Record<string, SeoConfig> = {
  '/': {
    title: 'Doggzy - Every Dog Deserves a Happy Ending',
    description: 'Join our global movement to rescue...',
    keywords: ['dog rescue', 'animal charity', ...]
  }
}
```

## Translations

Translation files are in `src/i18n/` organized by namespace:

- **Navigation:** `src/i18n/navigation.en.json`
- **Forms:** `src/i18n/forms.en.json`
- **Common words:** `src/i18n/common.en.json`

Example:
```json
{
  "home": "Home",
  "donate": "Donate",
  "newButton": "New Button Text"
}
```

## Images and Videos

### Adding New Images

1. **Place the image** in the appropriate folder:
   - Dogs: `public/images/dogs/`
   - Team photos: `public/images/team/`
   - Categories: `public/images/categories/`
   - General: `public/images/`

2. **Optimize the image** (optional but recommended):
   ```bash
   npm run optimize-images
   ```

3. **Update the media registry** in `src/lib/media.ts`:
   ```typescript
   dogs: {
     'new-dog': {
       id: 'new-dog',
       type: 'image' as const,
       src: '/images/dogs/new-dog.jpg',
       alt: 'New Dog - Description',
       width: 400,
       height: 400
     }
   }
   ```

4. **Use in content** by updating the relevant JSON file:
   ```json
   {
     "media": {
       "type": "image",
       "src": "/images/dogs/new-dog.jpg",
       "alt": "New Dog - Description"
     }
   }
   ```

### Adding New Videos

1. **Place the video** in `public/videos/`
2. **Update the media registry** in `src/lib/media.ts`
3. **Reference in content** JSON files

## Common Editing Tasks

### Changing the Hero Section

**File:** `src/content/pages/home.json`

```json
{
  "hero": {
    "badge": "Trusted by 50,000+ Donors",
    "title": "Every Dog Deserves",
    "titleHighlight": "A Happy Ending",
    "subtitle": "Your new subtitle here...",
    "primaryCta": {
      "label": "Your Button Text",
      "href": "/your-link"
    }
  }
}
```

### Adding a New Page

1. **Create the page component** in `src/app/new-page/page.tsx`
2. **Add content file** at `src/content/pages/new-page.json`
3. **Add to navigation** in `src/config/navigation.ts`
4. **Add SEO settings** in `src/config/seo.ts`
5. **Add to sitemap** in `src/config/routes.ts`

### Changing Button Text

Look for the button in the relevant content JSON file and update the `label` field:

```json
{
  "primaryCta": {
    "label": "New Button Text",
    "href": "/same-link"
  }
}
```

### Updating Statistics

**File:** `src/content/pages/home.json`

```json
{
  "impact": {
    "stats": [
      {
        "id": "dogs-saved",
        "label": "Dogs Saved",
        "value": "15,247",
        "change": "+12%",
        "changeType": "positive"
      }
    ]
  }
}
```

### Changing Footer Links

**File:** `src/config/navigation.ts`

```typescript
export const footerNavigation = {
  main: [
    {
      title: 'Get Involved',
      links: [
        { label: 'Adopt a Dog', href: '/adopt' },
        // Add new links here
      ]
    }
  ]
}
```

## Testing Your Changes

After making changes, always test:

1. **Check for errors:**
   ```bash
   npm run check
   ```

2. **Preview locally:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Image Guidelines

### File Formats
- **Use WebP** for modern browsers (best compression)
- **Provide JPEG fallback** for older browsers
- **Use PNG only** for images with transparency

### File Sizes
- **Thumbnails:** < 50KB
- **Card images:** < 150KB
- **Hero images:** < 500KB
- **Full-size images:** < 1MB

### Naming Convention
Use descriptive, hyphenated names:
- `hero-adoption-success.webp`
- `dog-bella-portrait.jpg`
- `team-sarah-headshot.jpg`

### Alt Text
Always provide meaningful alt text:
```json
{
  "alt": "Bella, a golden retriever, playing in a sunny park with her new family"
}
```

## Video Guidelines

### Specifications
- **Format:** MP4 (H.264)
- **Max size:** 5MB for hero videos, 10MB for stories
- **Length:** 30 seconds or less for hero videos
- **Resolution:** 1920×1080 maximum

### Accessibility
- Always mute autoplay videos
- Provide captions for videos with speech
- Include descriptive alt text

## Getting Help

If you need help with editing:

1. **Check the file structure** in your code editor
2. **Look at existing examples** in the content files
3. **Use the search function** to find similar content
4. **Test your changes** with `npm run dev`

## Advanced Tips

### Bulk Updates
For changing the same text across multiple files, use your editor's "Find and Replace" feature across the entire `src/content/` directory.

### Content Validation
The content system uses TypeScript and Zod schemas to validate your changes. If you see errors after editing, check:
- JSON syntax is valid
- Required fields are present
- Field types match expectations

### Performance
- Always optimize images before adding them
- Keep video files under size limits
- Test page load speed after major changes

---

*Last updated: January 2025*