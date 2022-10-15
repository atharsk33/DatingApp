using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    public partial class MessageEntityUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_ReceipientId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ReceipientId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ReceipientId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ReceipentId",
                table: "Messages",
                newName: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RecipientId",
                table: "Messages",
                column: "RecipientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_RecipientId",
                table: "Messages",
                column: "RecipientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_RecipientId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_RecipientId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "RecipientId",
                table: "Messages",
                newName: "ReceipentId");

            migrationBuilder.AddColumn<int>(
                name: "ReceipientId",
                table: "Messages",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReceipientId",
                table: "Messages",
                column: "ReceipientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_ReceipientId",
                table: "Messages",
                column: "ReceipientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
