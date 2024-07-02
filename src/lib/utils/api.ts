import { request, gql } from 'graphql-request';

const endpoint = 'https://maximum-grackle-73.hasura.app/v1/graphql';

// Function to fetch all profiles
export async function fetchProfiles(filters = {}) {
    const query = gql`
        query GetProfiles($where: profiles_bool_exp) {
            profiles(where: $where) {
                id
                name
                profileType {
                    name
                }
                profileSector {
                    name
                }
                profileStatus {
                    name
                }
                foundingDate
                descriptionShort
                products {
                    id
                    name
                    productType {
                        name
                    }
                    descriptionShort
                    urlToProduct
                    productStatus {
                        name
                    }
                    launchDate
                    productDeployedOnProduct {
                        name
                    }
                }
                tagLine
                urlMain
            }
        }
    `;

    try {
        const data = await request(endpoint, query, { where: filters });
        return data.profiles;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

// Function to fetch a single profile by ID
export async function fetchProfileDetails(id: string) {
    const query = gql`
        query GetProfileDetails($id: Int!) {
            profiles_by_pk(id: $id) {
                id
                name
                profileType {
                    name
                }
                profileSector {
                    name
                }
                profileStatus {
                    name
                }
                foundingDate
                descriptionShort
                descriptionLong
                tagLine
                urlMain
                urlBlog
                urlDocumentation
                urlWhitepaper
                products {
                    id
                    name
                    productType {
                        name
                    }
                    descriptionShort
                    urlToProduct
                    productStatus {
                        name
                    }
                    launchDate
                    productDeployedOnProduct {
                        name
                    }
                }
                assets {
                    id
                    name
                    ticker
                    assetType {
                        name
                    }
                    shortDescription
                    address
                }
                socials {
                    id
                    socialType {
                        name
                    }
                    name
                    url
                }
            }
        }
    `;

    try {
        const data = await request(endpoint, query, { id: parseInt(id, 10) });
        return data.profiles_by_pk;
    } catch (error) {
        console.error('Error fetching profile details:', error);
        throw error;
    }
}
// Function to fetch products
export async function fetchProducts(filters = {}) {
    const query = gql`
        query GetProducts($where: products_bool_exp) {
            products(where: $where) {
                id
                name
                productType
                descriptionShort
                urlToProduct
                productStatus
                launchDate
                profileId
            }
        }
    `;

    try {
        const data = await request(endpoint, query, { where: filters });
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Function to fetch assets
export async function fetchAssets(filters = {}) {
    const query = gql`
        query GetAssets($where: assets_bool_exp) {
            assets(where: $where) {
                id
                name
                ticker
                assetType
                shortDescription
                address
                assetStandard
                profileId
            }
        }
    `;

    try {
        const data = await request(endpoint, query, { where: filters });
        return data.assets;
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }
}

// Function to fetch social media profiles
export async function fetchSocialMediaProfiles(filters = {}) {
    const query = gql`
        query GetSocialMediaProfiles($where: socials_bool_exp) {
            socials(where: $where) {
                id
                socialType
                name
                url
                profileId
            }
        }
    `;

    try {
        const data = await request(endpoint, query, { where: filters });
        return data.socials;
    } catch (error) {
        console.error('Error fetching social media profiles:', error);
        throw error;
    }
}