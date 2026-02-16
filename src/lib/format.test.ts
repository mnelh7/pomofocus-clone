import { describe, expect, it } from 'vitest'
import { formatMMSS } from './format'

describe('formatMMSS', () => {
  it.each([
    [0, '00:00'],
    [5, '00:05'],
    [59, '00:59'],
    [60, '01:00'],
    [61, '01:01'],
    [600, '10:00'],
    [1500, '25:00'],
  ])('formats %i seconds as %s', (seconds, expected) => {
    expect(formatMMSS(seconds)).toBe(expected)
  })
})
