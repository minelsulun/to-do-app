fetch("https://api.gratis.com/gratiscommercewebservices/v2/gratis/products/search?fields=FULL&query=%3Arelevance%3AallCategories%3A${numara}&currentPage=172&pageSize=21&lang=tr&curr=TRY")
.then(res=> res.json().then(data=> {console.log(data)}))

fetch("https://api.gratis.com/gratiscommercewebservices/v2/gratis/categories")
    .then(res => res.json())
    .then(data => {
        console.log(data);  // Kategori verilerini burada inceleyebilirsiniz
    });


function getGratisProducts(categoryId:number, page:number, pageSize:number = 21) {
    return fetch(`https://api.gratis.com/gratiscommercewebservices/v2/gratis/products/search?fields=FULL&query=%3Arelevance%3AallCategories%3A${categoryId}&currentPage=${page}&pageSize=${pageSize}&lang=tr&curr=TRY`)
        .then(res => res.json())
        .then(data => data);
}

function getTotalPages(categoryId:number, pageSize:number = 21) {
    return fetch(`https://api.gratis.com/gratiscommercewebservices/v2/gratis/products/search?fields=FULL&query=%3Arelevance%3AallCategories%3A${categoryId}&currentPage=1&pageSize=${pageSize}&lang=tr&curr=TRY`)
        .then(res => res.json())
        .then(data => {
            const totalPages = data.breadcrumbs.pagination.totalPages;
            return totalPages
        });
}

const categories: {id: number, name: string}[] = [
    { id:501, name: ""}
];