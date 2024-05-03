using { com.sap.pgp.dev.inventory as my } from '../db/schema';
using { managed, sap } from '@sap/cds/common';
@(path:'/inventory')
service InventoryService {
    entity Products as projection on my.Products;
    entity Plants as projection on my.Plants;
    entity Products2Plants as projection on my.Products2Plants
    {
     *,
     Plants.PlantDesc as plantdescription,
     Plants.StockQAvailable as StockQAvailable,
     Plants.Supplier as Supplier,
     Plants.SupplierName as SupplierName,
     Plants.SupplierPartNo as SupplierPartNo,
     Plants.UOM as UOM,
     Plants.ManufacturerName as ManufacturerName,
     Plants.ReorderPoint as ReorderPoint,
     Plants.ProductPicUrl as ProductPicUrl,
     Plants.AvailabilityStatus as AvailabilityStatus,
     Plants.ReorderQuantity as ReorderQuantity,
     Products.UnitPrice as UnitPrice,
     Products.Currency as Currency,
     Products.Category as Category,
     Products.CategoryDesc as CategoryDesc,
     Products.ProductId as ProductId,
     Products.ProductDesc as ProductDesc
    };

    function GetInventory() returns String;

   entity EmployeeProfile as projection on my.EmployeeProfile;

   entity GoodsIssue as projection on my.GoodsIssue;

   entity GoodsReceipt as projection on my.GoodsReceipt;

   entity PurchaseRequisition as projection on my.PurchaseRequisition;

   entity PRGoodsIssue as projection on my.PRGoodsIssue;
   
   
   
}