import { request, gql } from 'graphql-request';

const endpoint = 'https://maximum-grackle-73.hasura.app/v1/graphql';

export async function compareProjects(projectIds) {
    const query = gql`
        query GetProjects($ids: [uuid!]) {
            profiles(where: {id: {_in: $ids}}) {
                id
                name
                profileType
                profileSector
                profileStatus
                foundingDate
                descriptionShort
                descriptionLong
                tagLine
                urlMain
                urlBlog
                urlDocumentation
                urlWhitepaper
                products {
                    name
                    productType
                    descriptionShort
                }
                assets {
                    name
                    ticker
                    assetType
                }
                socials {
                    socialType
                    name
                }
            }
        }
    `;

    try {
        const data = await request(endpoint, query, { ids: projectIds });
        const projects = data.profiles;

        const comparisonFields = [
            { key: 'name', label: 'Project Name', type: 'string' },
            { key: 'profileType', label: 'Type', type: 'string' },
            { key: 'profileSector', label: 'Sector', type: 'string' },
            { key: 'profileStatus', label: 'Current Status', type: 'string' },
            { key: 'foundingDate', label: 'Founding Date', type: 'date' },
            { key: 'descriptionShort', label: 'Short Description', type: 'string' },
            { key: 'tagLine', label: 'Tag Line', type: 'string' },
            { key: 'urlMain', label: 'Main URL', type: 'url' },
            { key: 'urlBlog', label: 'Blog URL', type: 'url' },
            { key: 'urlDocumentation', label: 'Documentation URL', type: 'url' },
            { key: 'urlWhitepaper', label: 'Whitepaper URL', type: 'url' }
        ];

        const comparisonData = comparisonFields.map(field => ({
            field: field.label,
            type: field.type,
            values: projects.map(project => ({
                projectId: project.id,
                value: project[field.key] || 'N/A'
            }))
        }));

        // Format dates
        comparisonData.find(row => row.field === 'Founding Date').values =
            comparisonData.find(row => row.field === 'Founding Date').values.map(item => ({
                ...item,
                value: item.value !== 'N/A' ? new Date(item.value).toLocaleDateString() : 'N/A'
            }));

        // Add product comparison
        comparisonData.push({
            field: 'Products',
            type: 'list',
            values: projects.map(project => ({
                projectId: project.id,
                value: project.products.length > 0
                    ? project.products.map(product => `${product.name} (${product.productType})`).join(', ')
                    : 'N/A'
            }))
        });

        // Add asset comparison
        comparisonData.push({
            field: 'Assets',
            type: 'list',
            values: projects.map(project => ({
                projectId: project.id,
                value: project.assets.length > 0
                    ? project.assets.map(asset => `${asset.name} (${asset.ticker})`).join(', ')
                    : 'N/A'
            }))
        });

        // Add social media comparison
        comparisonData.push({
            field: 'Social Media',
            type: 'list',
            values: projects.map(project => ({
                projectId: project.id,
                value: project.socials.length > 0
                    ? project.socials.map(social => `${social.socialType}: ${social.name}`).join(', ')
                    : 'N/A'
            }))
        });

        return comparisonData;
    } catch (error) {
        console.error('Error fetching project data:', error);
        throw error;
    }
}