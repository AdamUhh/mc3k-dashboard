import {
    CreateProductType,
    DeleteProductType,
    ServerProduct,
    UpdateProductType,
} from '@/db/validations/products';

import {
    createFeatures,
    createProduct,
    createProductCollections as createProductToCollections,
    createProductCollections as createProductsToCollections,
    deleteFeature,
    deleteProduct,
    deleteProductToCollection,
    getCoreData,
    getProducts,
    updateFeature,
    updateProduct,
    updateProductToCollections,
} from '@/data-access/products';

export async function getCoreDataUseCase(authenticatedUser: string) {
    return await getCoreData(authenticatedUser);
}
// use cases will be used to call multiple data access calls
export async function getProductsUseCase(authenticatedUser: string) {
    return await getProducts(authenticatedUser);
}

export async function createProductUseCase(
    authenticatedUser: string,
    values: CreateProductType
) {
    const { features, collections, ...data } = values;

    const product = await createProduct(
        authenticatedUser,
        // TODO: remove 'as', later after adding modelid,brandid, etc
        data as ServerProduct
    );

    const newFeatures =
        product && features && features.length > 0
            ? createFeatures(
                  features.map((f, i) => ({
                      name: f.name,
                      description: f.description,
                      order: i, // for creation, use index for order
                      productId: product.id,
                      userId: authenticatedUser,
                  }))
              )
            : [];

    const newCollections =
        product && collections && collections.length > 0
            ? createProductsToCollections(
                  collections.map((f) => ({
                      collectionId: f.id,
                      productId: product.id,
                      userId: authenticatedUser,
                  }))
              )
            : [];

    return { product, features: newFeatures, collections: newCollections };
}

export async function updateProductUseCase(
    userId: string,
    values: Partial<UpdateProductType> & { id: string }
) {
    const { features, collections, ...productData } = values;

    if (Object.keys(productData).length > 1) {
        await updateProduct(
            userId,
            // TODO: remove 'as', later after adding modelid,brandid, etc
            productData as Partial<ServerProduct> & { id: string }
        );
    }

    if (features) {
        const { updateFeatures, deleteFeatures, newFeatures } = features;

        await Promise.all(
            [
                updateFeatures?.length &&
                    Promise.all(
                        updateFeatures.map((f) => updateFeature(userId, f))
                    ),
                deleteFeatures?.length &&
                    Promise.all(
                        deleteFeatures.map((f) =>
                            deleteFeature(userId, { id: f.id })
                        )
                    ),
                newFeatures?.length &&
                    createFeatures(
                        newFeatures.map((f) => ({
                            name: f.name,
                            order: f.order,
                            description: f.description,
                            userId,
                            productId: productData.id,
                        }))
                    ),
            ].filter(Boolean)
        );
    }

    if (collections) {
        const { updateCollections, deleteCollections, newCollections } =
            collections;

        await Promise.all(
            [
                updateCollections?.length &&
                    Promise.all(
                        updateCollections.map((f) =>
                            updateProductToCollections(userId, {
                                id: f.id,
                                collectionId: f.newId,
                            })
                        )
                    ),
                deleteCollections?.length &&
                    Promise.all(
                        deleteCollections.map((f) =>
                            deleteProductToCollection(userId, { id: f.id })
                        )
                    ),
                newCollections?.length &&
                    createProductToCollections(
                        newCollections.map((f) => ({
                            collectionId: f.id,
                            productId: productData.id,
                            userId,
                        }))
                    ),
            ].filter(Boolean)
        );
    }

    return true;
}
export async function deleteProductUseCase(
    authenticatedUser: string,
    values: DeleteProductType
) {
    return await deleteProduct(authenticatedUser, values);
}
