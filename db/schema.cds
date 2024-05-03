using { managed, sap, cuid } from '@sap/cds/common';
namespace com.sap.pgp.dev.inventory;

entity Products : managed {
   key  UniqueID : UUID;
        ProductId : String;
        ProductDesc  : String;
        Category : String;
        CategoryDesc: String;
        Products2Plants : Association to many Products2Plants on Products2Plants.Products =  $self; 
        UnitPrice: String;
        Currency: String;
        ProdPicUrl: String;
            }

entity Plants: cuid {
key Plant: String;
    PlantDesc: String;
    Products2Plants : Association to many Products2Plants on Products2Plants.Plants=$self;
    Supplier : String;
    SupplierName : String;
    SupplierPartNo: String;
    StockQAvailable: String;
    UOM: String;
    ManufacturerName: String;
    ReorderPoint: String;
    ProductPicUrl: String;
    AvailabilityStatus:String;
    ReorderQuantity: String;
}

entity Products2Plants: cuid {
   Plants: Association to Plants;
   Products : Association to Products;
}

entity EmployeeProfile : managed {
   key  EmployeeID : String;
        FirstName : String;
        LastName  : String;
        GLAccount : String;
        CompanyCode: String;
        CostCenter : String; 
        PurchOrg: String;
        Location: String;
            }

entity GoodsIssue : managed {
    key GIssueID    : UUID;
        RequesterID : String;
        CostCenter : String; 
        CompanyCode: String;
        Location: String;
        Requisition: String;
        ProductID: String;
        Quantity: String;
        GLAccount: String;  
            }

entity GoodsReceipt : managed {
    key GRID    : UUID;
        PRID : String;
        POID : String; 
        Location: String;
        ProductID: String;
        Quantity: String;
             }

entity PurchaseRequisition : managed {
    key PRID    : String;
    key Products2PlantsID : UUID;
        CreatedDate : String;
        SupplierID : String; 
        SupplierName: String;
        PlantID: String;
        PlantDesc: String;
        ProductId: String;
        ProductDesc: String;
        PlantsPlantUID: UUID;
        UnitPrice: String;
        Currency:String;
        ReorderQuantity:String;
        Status: String;
            }

entity PRGoodsIssue : managed {
    key PRID    : String;
    key PRItem : String;
        Requester : String;
        CompanyCode : String; 
        CostCenter: String;
        GLAccount: String;
        Location: String;
        ProductId: String;
        ProductDesc: String;
        Quantity: String;
        UOM: String;
        GIComplete: String;
        
            }