using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketManagement.Migrations
{
    /// <inheritdoc />
    public partial class FixUserForeignKeysEverywhere : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketActivities_Users_PerformedByUserId",
                table: "TicketActivities");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketAssignments_Users_AssignedBy",
                table: "TicketAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketAssignments_Users_AssignedTo",
                table: "TicketAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketComments_Users_CreatedByUserId",
                table: "TicketComments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_AssignedTo",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_CreatedBy",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TicketComments");

            migrationBuilder.DropColumn(
                name: "PerformedBy",
                table: "TicketActivities");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Tickets",
                newName: "CreatedByUserId");

            migrationBuilder.RenameColumn(
                name: "AssignedTo",
                table: "Tickets",
                newName: "AssignedToUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_CreatedBy",
                table: "Tickets",
                newName: "IX_Tickets_CreatedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_AssignedTo",
                table: "Tickets",
                newName: "IX_Tickets_AssignedToUserId");

            migrationBuilder.RenameColumn(
                name: "AssignedTo",
                table: "TicketAssignments",
                newName: "AssignedToUserId");

            migrationBuilder.RenameColumn(
                name: "AssignedBy",
                table: "TicketAssignments",
                newName: "AssignedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_TicketAssignments_AssignedTo",
                table: "TicketAssignments",
                newName: "IX_TicketAssignments_AssignedToUserId");

            migrationBuilder.RenameIndex(
                name: "IX_TicketAssignments_AssignedBy",
                table: "TicketAssignments",
                newName: "IX_TicketAssignments_AssignedByUserId");

            migrationBuilder.AddColumn<string>(
                name: "FieldName",
                table: "TicketActivities",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketActivities_Users_PerformedByUserId",
                table: "TicketActivities",
                column: "PerformedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketAssignments_Users_AssignedByUserId",
                table: "TicketAssignments",
                column: "AssignedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketAssignments_Users_AssignedToUserId",
                table: "TicketAssignments",
                column: "AssignedToUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketComments_Users_CreatedByUserId",
                table: "TicketComments",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_AssignedToUserId",
                table: "Tickets",
                column: "AssignedToUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_CreatedByUserId",
                table: "Tickets",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketActivities_Users_PerformedByUserId",
                table: "TicketActivities");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketAssignments_Users_AssignedByUserId",
                table: "TicketAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketAssignments_Users_AssignedToUserId",
                table: "TicketAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketComments_Users_CreatedByUserId",
                table: "TicketComments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_AssignedToUserId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_CreatedByUserId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "FieldName",
                table: "TicketActivities");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "Tickets",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "AssignedToUserId",
                table: "Tickets",
                newName: "AssignedTo");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_CreatedByUserId",
                table: "Tickets",
                newName: "IX_Tickets_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_AssignedToUserId",
                table: "Tickets",
                newName: "IX_Tickets_AssignedTo");

            migrationBuilder.RenameColumn(
                name: "AssignedToUserId",
                table: "TicketAssignments",
                newName: "AssignedTo");

            migrationBuilder.RenameColumn(
                name: "AssignedByUserId",
                table: "TicketAssignments",
                newName: "AssignedBy");

            migrationBuilder.RenameIndex(
                name: "IX_TicketAssignments_AssignedToUserId",
                table: "TicketAssignments",
                newName: "IX_TicketAssignments_AssignedTo");

            migrationBuilder.RenameIndex(
                name: "IX_TicketAssignments_AssignedByUserId",
                table: "TicketAssignments",
                newName: "IX_TicketAssignments_AssignedBy");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "TicketComments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PerformedBy",
                table: "TicketActivities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketActivities_Users_PerformedByUserId",
                table: "TicketActivities",
                column: "PerformedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketAssignments_Users_AssignedBy",
                table: "TicketAssignments",
                column: "AssignedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketAssignments_Users_AssignedTo",
                table: "TicketAssignments",
                column: "AssignedTo",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketComments_Users_CreatedByUserId",
                table: "TicketComments",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_AssignedTo",
                table: "Tickets",
                column: "AssignedTo",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_CreatedBy",
                table: "Tickets",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
