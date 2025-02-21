import { describe, expect, it } from '@jest/globals';

import { getChangedFieldsDeep } from '@/lib/utils';

// just run `yarn jest`

describe('getChangedFieldsDeep for Features', () => {
    const baseFeature = {
        id: '1',
        name: 'Original Feature',
        description: 'Original Description',
        order: 0,
    };

    const baseFeature2 = {
        id: '2',
        name: 'Second Feature',
        description: 'Second Description',
        order: 1,
    };

    const baseFeature3 = {
        id: '3',
        name: 'Third Feature',
        description: 'Third Description',
        order: 2,
    };

    describe('Single Feature Changes', () => {
        it('detects name change', () => {
            const result = getChangedFieldsDeep(
                { features: [{ name: true }] },
                { features: [{ ...baseFeature, name: 'New Feature' }] },
                { features: [baseFeature] }
            );
            expect(result).toEqual({
                features: [{ id: '1', name: 'New Feature' }],
            });
        });

        it('detects description change', () => {
            const result = getChangedFieldsDeep(
                { features: [{ description: true }] },
                {
                    features: [
                        { ...baseFeature, description: 'New Description' },
                    ],
                },
                { features: [baseFeature] }
            );
            expect(result).toEqual({
                features: [{ id: '1', description: 'New Description' }],
            });
        });

        it('ignores unchanged fields when one field changes', () => {
            const result = getChangedFieldsDeep(
                { features: [{ name: true, description: false }] },
                { features: [{ ...baseFeature, name: 'New Feature' }] },
                { features: [baseFeature] }
            );
            expect(result).toEqual({
                features: [{ id: '1', name: 'New Feature' }],
            });
        });
    });

    describe('Multiple Feature Changes', () => {
        it('handles multiple field changes in single feature', () => {
            const result = getChangedFieldsDeep(
                { features: [{ name: true, description: true }] },
                {
                    features: [
                        {
                            ...baseFeature,
                            name: 'Updated Name',
                            description: 'Updated Description',
                        },
                    ],
                },
                { features: [baseFeature] }
            );
            expect(result).toEqual({
                features: [
                    {
                        id: '1',
                        name: 'Updated Name',
                        description: 'Updated Description',
                    },
                ],
            });
        });

        it('handles changes in multiple features', () => {
            const result = getChangedFieldsDeep(
                {
                    features: [{ name: true }, { description: true }],
                },
                {
                    features: [
                        { ...baseFeature, name: 'Updated First' },
                        { ...baseFeature2, description: 'Updated Second' },
                    ],
                },
                {
                    features: [baseFeature, baseFeature2],
                }
            );
            expect(result).toEqual({
                features: [
                    { id: '1', name: 'Updated First' },
                    { id: '2', description: 'Updated Second' },
                ],
            });
        });
    });

    describe('Order Changes', () => {
        it('detects simple order change between two items', () => {
            const result = getChangedFieldsDeep(
                { features: [{ name: true }, { name: false }] },
                { features: [baseFeature2, baseFeature] },
                { features: [baseFeature, baseFeature2] }
            );
            expect(result).toEqual({
                features: [
                    { id: '2', order: 0 },
                    { id: '1', order: 1 },
                ],
            });
        });

        it('detects complex order changes among multiple items', () => {
            const result = getChangedFieldsDeep(
                { features: [{ name: true }, { name: false }, { name: true }] },
                { features: [baseFeature3, baseFeature, baseFeature2] },
                { features: [baseFeature, baseFeature2, baseFeature3] }
            );
            expect(result).toEqual({
                features: [
                    { id: '3', order: 0 },
                    { id: '1', order: 1 },
                    { id: '2', order: 2 },
                ],
            });
        });

        it('combines order changes with field changes', () => {
            const result = getChangedFieldsDeep(
                { features: [{ description: true }, { name: true }] },
                {
                    features: [
                        { ...baseFeature2, description: 'New Desc' },
                        { ...baseFeature, name: 'New Name' },
                    ],
                },
                { features: [baseFeature, baseFeature2] }
            );

            expect(result).toEqual({
                features: [
                    { id: '2', description: 'New Desc', order: 0 },
                    { id: '1', name: 'New Name', order: 1 },
                ],
            });
        });
    });

    describe('Addition and Deletion', () => {
        it('handles new feature addition', () => {
            const newFeature = {
                id: 'new',
                name: 'New Feature',
                description: 'New Description',
                isNew: true,
            };
            const result = getChangedFieldsDeep(
                {
                    features: [
                        { name: false },
                        { name: true, description: true },
                    ],
                },
                { features: [baseFeature, newFeature] },
                { features: [baseFeature] }
            );
            expect(result).toEqual({
                features: [
                    {
                        ...newFeature,
                        order: 1,
                    },
                ],
            });
        });

        it('handles multiple new features', () => {
            const newFeature1 = {
                id: 'new1',
                name: 'New Feature 1',
                description: 'New Description 1',
                isNew: true,
                order: 1,
            };
            const newFeature2 = {
                id: 'new2',
                name: 'New Feature 2',
                description: 'New Description 2',
                isNew: true,
                order: 2,
            };
            const result = getChangedFieldsDeep(
                {
                    features: [
                        { name: false },
                        { name: true, description: true },
                        { name: true, description: true },
                    ],
                },
                { features: [baseFeature, newFeature1, newFeature2] },
                { features: [baseFeature] }
            );
            expect(result).toEqual({
                features: [{ ...newFeature1 }, { ...newFeature2 }],
            });
        });

        it('handles feature deletion', () => {
            const result = getChangedFieldsDeep(
                { features: [{ toDelete: true }, { name: false }] },
                {
                    features: [
                        { ...baseFeature, toDelete: true },
                        baseFeature2,
                    ],
                },
                { features: [baseFeature, baseFeature2] }
            );
            console.log('Actual Result:', JSON.stringify(result, null, 2)); // Log the output
            expect(result).toEqual({
                features: [
                    { id: '1', toDelete: true },
                    {
                        order: 0,
                        id: '2',
                    },
                ],
            });
        });

        it('handles multiple feature deletions', () => {
            const result = getChangedFieldsDeep(
                {
                    features: [
                        { toDelete: true },
                        { toDelete: true },
                        { name: false },
                    ],
                },
                {
                    features: [
                        { ...baseFeature, toDelete: true },
                        { ...baseFeature2, toDelete: true },
                        baseFeature3,
                    ],
                },
                { features: [baseFeature, baseFeature2, baseFeature3] }
            );
            expect(result).toEqual({
                features: [
                    { id: '1', toDelete: true },
                    { id: '2', toDelete: true },
                    {
                        order: 0,
                        id: '3',
                    },
                ],
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles empty features array', () => {
            const result = getChangedFieldsDeep(
                { features: [] },
                { features: [] },
                { features: [] }
            );
            expect(result).toEqual({});
        });

        it('handles null features', () => {
            const result = getChangedFieldsDeep(
                { features: null },
                { features: null },
                { features: null }
            );
            expect(result).toEqual({});
        });

        it('handles undefined features', () => {
            const result = getChangedFieldsDeep(
                { features: undefined },
                { features: undefined },
                { features: undefined }
            );
            expect(result).toEqual({});
        });

        it('maintains order when deleting middle item', () => {
            const result = getChangedFieldsDeep(
                {
                    features: [
                        { name: false },
                        { toDelete: true },
                        { name: false },
                    ],
                },
                {
                    features: [
                        baseFeature,
                        { ...baseFeature2, toDelete: true },
                        baseFeature3,
                    ],
                },
                { features: [baseFeature, baseFeature2, baseFeature3] }
            );
            console.log(result);
            expect(result).toEqual({
                features: [
                    {
                        id: '2',
                        toDelete: true,
                    },
                    {
                        id: '3',
                        order: 1,
                    },
                ],
            });
        });
    });
});
