import { MigrationInterface, QueryRunner } from "typeorm";

export class Teste1733148896349 implements MigrationInterface {
    name = 'Teste1733148896349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`shortener\` (\`id\` int NOT NULL AUTO_INCREMENT, \`originalURL\` varchar(255) NOT NULL, \`shortenerURL\` varchar(255) NOT NULL, \`clicks\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`IDX_1dfe7cbd40dea326024b562751\` (\`shortenerURL\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`shortener\` ADD CONSTRAINT \`FK_8d202bb929d7f016eab31166fa9\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shortener\` DROP FOREIGN KEY \`FK_8d202bb929d7f016eab31166fa9\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_1dfe7cbd40dea326024b562751\` ON \`shortener\``);
        await queryRunner.query(`DROP TABLE \`shortener\``);
    }

}
