import prisma from '../../utils/prisma'

export interface HeroImage {
  url: string
  alt: string
}

export interface HeroButton {
  text: string
  url: string
  variant: 'primary' | 'secondary'
}

export interface HeroSection {
  title: string
  subtitle: string
  description: string
  images: HeroImage[]
  buttons: HeroButton[]
  isActive: boolean
}

export async function validateHeroSection(data: Partial<HeroSection>): Promise<string[]> {
  const errors: string[] = []

  if (data.title && data.title.length < 3) {
    errors.push('Title must be at least 3 characters long')
  }

  if (data.subtitle && data.subtitle.length < 3) {
    errors.push('Subtitle must be at least 3 characters long')
  }

  if (data.description && data.description.length < 10) {
    errors.push('Description must be at least 10 characters long')
  }

  if (data.images) {
    if (!Array.isArray(data.images)) {
      errors.push('Images must be an array')
    } else {
      data.images.forEach((image, index) => {
        if (!image.url) {
          errors.push(`Image at index ${index} must have a URL`)
        }
        if (!image.alt) {
          errors.push(`Image at index ${index} must have an alt text`)
        }
      })
    }
  }

  if (data.buttons) {
    if (!Array.isArray(data.buttons)) {
      errors.push('Buttons must be an array')
    } else {
      data.buttons.forEach((button, index) => {
        if (!button.text) {
          errors.push(`Button at index ${index} must have text`)
        }
        if (!button.url) {
          errors.push(`Button at index ${index} must have a URL`)
        }
        if (button.variant && !['primary', 'secondary'].includes(button.variant)) {
          errors.push(`Button at index ${index} must have a valid variant (primary or secondary)`)
        }
      })
    }
  }

  return errors
}

export async function deactivateOtherHeroSections(currentId?: string): Promise<void> {
  await prisma.heroSection.updateMany({
    where: {
      isActive: true,
      ...(currentId ? { id: { not: currentId } } : {})
    },
    data: {
      isActive: false
    }
  })
}

export async function getActiveHeroSection(): Promise<HeroSection | null> {
  return prisma.heroSection.findFirst({
    where: {
      isActive: true
    },
    include: {
      images: true,
      buttons: true
    }
  })
} 