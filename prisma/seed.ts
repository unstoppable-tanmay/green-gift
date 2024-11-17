import { hashSync } from "bcrypt";
import prisma from "./prisma";

import data from "./data/data.json";

async function createUser() {
  await prisma.address.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.user.deleteMany();

  const userData = data.users[0];
  const user = await prisma.user.create({
    data: {
      phone: userData.phone,
      email: userData.email,
      password: hashSync(userData.password, 10),
      name: userData.name,
      addresses: {
        createMany: {
          data: userData.addresses.map((address) => ({
            address: address.address,
          })),
        },
      },
      Cart: {
        create: {},
      },
      Wallet: {
        create: {
          balance: 1000,
        },
      },
      Wishlist: {
        create: {},
      },
    },
  });

  console.log("User created:", user);
}

async function createProducts() {
  await prisma.tips.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const products = data.products;

  for (const product of products) {
    let category;
    category = await prisma.category.findFirst({
      where: {
        name: product.Category.name,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: product.Category.name,
          description: product.Category.description,
          image: product.Category.image,
        },
      });

      console.log("Category created:", category);
    }

    const createdProducts = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        about: product.about,
        object: product.object,
        stars: product.stars,
        images: product.image,
        categoryId: category.id,
        Tips: {
          createMany: {
            data: product.Tips.map((tip) => ({
              title: tip.title,
              content: tip.content,
            })),
          },
        },
      },
    });

    console.log("Products created:", createdProducts);
  }
}

async function createMarketingCampaigns() {
  await prisma.marketingCampaign.deleteMany();

  const campaigns = data.marketingCampaigns;

  for (const campaign of campaigns) {
    const createdCampaign = await prisma.marketingCampaign.create({
      data: {
        name: campaign.name,
        description: campaign.description,
        image: campaign.image,
      },
    });

    console.log("Marketing Campaign created:", createdCampaign);
  }
}

const main = async () => {
  // await createUser();
  // await createProducts();
  // await createMarketingCampaigns();
};

main();
