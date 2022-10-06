const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

// Instancia de prisma
// prisma se importará en las rutas cuando sea necesario

// Ejemplo para confirmar conexión
// async function main() {
//   const users = await prisma.usuarios.create({ data: { firstName: "Kyle", lastName: "Jhonson" } });
//   console.log(users);

//   const userBring = await prisma.usuarios.findMany();
//   console.log(userBring);
// }

// main()
//   .catch(e => {
//     console.error(e.message);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

module.exports = prisma;
