-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(32) NOT NULL DEFAULT 'owner',
    `passwordHash` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(255) NOT NULL,
    `unit` VARCHAR(64) NULL,
    `city` VARCHAR(128) NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `email` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `situation` VARCHAR(64) NOT NULL,
    `trusteeSaleDate` VARCHAR(32) NULL,
    `preferredPath` VARCHAR(32) NOT NULL,
    `language` VARCHAR(8) NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'new',
    `lostReason` VARCHAR(64) NULL,
    `sourcePath` VARCHAR(255) NOT NULL,
    `utmSource` VARCHAR(128) NULL,
    `utmMedium` VARCHAR(128) NULL,
    `utmCampaign` VARCHAR(128) NULL,
    `assignedToId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lead_phone_idx`(`phone`),
    INDEX `Lead_status_idx`(`status`),
    INDEX `Lead_createdAt_idx`(`createdAt`),
    INDEX `Lead_trusteeSaleDate_idx`(`trusteeSaleDate`),
    INDEX `Lead_assignedToId_idx`(`assignedToId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leadId` INTEGER NOT NULL,
    `channel` VARCHAR(16) NOT NULL,
    `textVersion` TEXT NOT NULL,
    `pageUrl` TEXT NOT NULL,
    `ipHash` VARCHAR(128) NOT NULL,
    `grantedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Consent_leadId_idx`(`leadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeadEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leadId` INTEGER NOT NULL,
    `author` VARCHAR(64) NOT NULL DEFAULT 'system',
    `authorId` INTEGER NULL,
    `type` VARCHAR(32) NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LeadEvent_leadId_idx`(`leadId`),
    INDEX `LeadEvent_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Listing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(128) NULL,
    `beds` INTEGER NULL,
    `baths` VARCHAR(16) NULL,
    `sqft` INTEGER NULL,
    `propertyType` VARCHAR(64) NULL,
    `price` VARCHAR(64) NULL,
    `listPrice` INTEGER NULL,
    `previousPrice` INTEGER NULL,
    `priceChangedAt` DATETIME(3) NULL,
    `monthlyPayment` INTEGER NULL,
    `terms` TEXT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `summary` TEXT NULL,
    `description` LONGTEXT NULL,
    `features` TEXT NULL,
    `neighborhood` TEXT NULL,
    `schools` TEXT NULL,
    `yearBuilt` INTEGER NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(300) NULL,
    `keywords` TEXT NULL,
    `localTags` TEXT NULL,
    `photos` TEXT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Listing_slug_key`(`slug`),
    INDEX `Listing_status_idx`(`status`),
    INDEX `Listing_city_idx`(`city`),
    INDEX `Listing_listPrice_idx`(`listPrice`),
    INDEX `Listing_featured_idx`(`featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListingPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `previousAmount` INTEGER NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ListingPrice_listingId_idx`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaAsset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `contentType` VARCHAR(128) NOT NULL,
    `kind` VARCHAR(32) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `folder` VARCHAR(128) NULL,
    `alt` VARCHAR(191) NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MediaAsset_key_key`(`key`),
    INDEX `MediaAsset_kind_idx`(`kind`),
    INDEX `MediaAsset_folder_idx`(`folder`),
    INDEX `MediaAsset_createdAt_idx`(`createdAt`),
    INDEX `MediaAsset_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `body` LONGTEXT NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
    `featuredImageUrl` TEXT NULL,
    `featuredImageAlt` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(300) NULL,
    `canonicalUrl` TEXT NULL,
    `ogImageUrl` TEXT NULL,
    `publishedAt` DATETIME(3) NULL,
    `authorId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Post_slug_key`(`slug`),
    INDEX `Post_status_idx`(`status`),
    INDEX `Post_publishedAt_idx`(`publishedAt`),
    INDEX `Post_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `parentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    INDEX `Category_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Tag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    INDEX `PostCategory_postId_idx`(`postId`),
    INDEX `PostCategory_categoryId_idx`(`categoryId`),
    UNIQUE INDEX `PostCategory_postId_categoryId_key`(`postId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,

    INDEX `PostTag_postId_idx`(`postId`),
    INDEX `PostTag_tagId_idx`(`tagId`),
    UNIQUE INDEX `PostTag_postId_tagId_key`(`postId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,
    `authorId` INTEGER NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `authorEmail` VARCHAR(191) NULL,
    `body` TEXT NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `isStaff` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Comment_postId_idx`(`postId`),
    INDEX `Comment_parentId_idx`(`parentId`),
    INDEX `Comment_status_idx`(`status`),
    INDEX `Comment_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consent` ADD CONSTRAINT `Consent_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadEvent` ADD CONSTRAINT `LeadEvent_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadEvent` ADD CONSTRAINT `LeadEvent_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListingPrice` ADD CONSTRAINT `ListingPrice_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaAsset` ADD CONSTRAINT `MediaAsset_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostCategory` ADD CONSTRAINT `PostCategory_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostCategory` ADD CONSTRAINT `PostCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTag` ADD CONSTRAINT `PostTag_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTag` ADD CONSTRAINT `PostTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

