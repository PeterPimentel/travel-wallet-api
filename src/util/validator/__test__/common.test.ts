import * as commonValidator from '../common';

describe('checkProperties', () => {
    const MOCK_PROPS = ['countryCode', 'countryName', 'cityName', 'region', 'label']
    const MOCK_DATA_INCOMPLETE = {
        countryCode: 'countryCode',
        countryName: 'countryName',
        cityName: 'cityName'
    }

    const MOCK_DATA_COMPLETE = {
        countryCode: 'countryCode',
        countryName: 'countryName',
        cityName: 'cityName',
        region: 'region',
        label: 'label',
    }

    test('should return the missing properties and valid as false', () => {
        const result = commonValidator.checkProperties(MOCK_DATA_INCOMPLETE, MOCK_PROPS)

        expect(result.fields).toEqual(['region', 'label'])
        expect(result.valid).toBe(false)
    })

    test('should return the empty missing properties and valid as true', () => {
        const result = commonValidator.checkProperties(MOCK_DATA_COMPLETE, MOCK_PROPS)

        expect(result.fields).toEqual([])
        expect(result.valid).toBe(true)
    })
})