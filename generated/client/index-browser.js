
/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */

Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.8.2
 * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
 */
Prisma.prismaVersion = {
  client: "6.8.2",
  engine: "2060c79ba17c6bb9f5823312b6f6b7f4a845738e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'password',
  role: 'role',
  accessLevel: 'accessLevel',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StaffInvitationScalarFieldEnum = {
  id: 'id',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  accessLevel: 'accessLevel',
  token: 'token',
  used: 'used',
  usedAt: 'usedAt',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  location: 'location',
  startDate: 'startDate',
  startTime: 'startTime',
  endDate: 'endDate',
  endTime: 'endTime',
  customerId: 'customerId',
  status: 'status',
  stage: 'stage',
  staffNotes: 'staffNotes',
  customerNotes: 'customerNotes',
  totalAmount: 'totalAmount',
  depositAmount: 'depositAmount',
  depositPaid: 'depositPaid',
  finalPaymentPaid: 'finalPaymentPaid',
  assignedStaffId: 'assignedStaffId',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventItemScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  productId: 'productId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventItemOptionScalarFieldEnum = {
  id: 'id',
  eventItemId: 'eventItemId',
  optionId: 'optionId',
  optionName: 'optionName',
  value: 'value',
  label: 'label',
  priceAdjustment: 'priceAdjustment',
  createdAt: 'createdAt'
};

exports.Prisma.EventStatusHistoryScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  fromStage: 'fromStage',
  toStage: 'toStage',
  notes: 'notes',
  changedBy: 'changedBy',
  changedAt: 'changedAt'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  hasRangePrice: 'hasRangePrice',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  hasUnitPrice: 'hasUnitPrice',
  unitPrice: 'unitPrice',
  unitType: 'unitType',
  minQuantity: 'minQuantity',
  imageUrl: 'imageUrl',
  active: 'active',
  canBuy: 'canBuy',
  canHire: 'canHire',
  categoryId: 'categoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  orderNumber: 'orderNumber',
  customerId: 'customerId',
  status: 'status',
  stage: 'stage',
  totalAmount: 'totalAmount',
  shippingAmount: 'shippingAmount',
  taxAmount: 'taxAmount',
  discountAmount: 'discountAmount',
  finalAmount: 'finalAmount',
  paymentStatus: 'paymentStatus',
  shippingAddress: 'shippingAddress',
  billingAddress: 'billingAddress',
  staffNotes: 'staffNotes',
  customerNotes: 'customerNotes',
  assignedStaffId: 'assignedStaffId',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  shippedAt: 'shippedAt',
  deliveredAt: 'deliveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemOptionScalarFieldEnum = {
  id: 'id',
  orderItemId: 'orderItemId',
  optionId: 'optionId',
  optionName: 'optionName',
  value: 'value',
  label: 'label',
  priceAdjustment: 'priceAdjustment',
  createdAt: 'createdAt'
};

exports.Prisma.OrderStatusHistoryScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  fromStage: 'fromStage',
  toStage: 'toStage',
  notes: 'notes',
  changedBy: 'changedBy',
  changedAt: 'changedAt'
};

exports.Prisma.HeroSettingScalarFieldEnum = {
  id: 'id',
  imageUrl: 'imageUrl',
  title: 'title',
  description: 'description',
  buttonText: 'buttonText',
  buttonLink: 'buttonLink',
  textPosition: 'textPosition',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductOptionScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  type: 'type',
  required: 'required',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductOptionValueScalarFieldEnum = {
  id: 'id',
  optionId: 'optionId',
  value: 'value',
  label: 'label',
  priceAdjustment: 'priceAdjustment',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskTemplateScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  description: 'description',
  category: 'category',
  estimatedDuration: 'estimatedDuration',
  leadTimeHours: 'leadTimeHours',
  sequenceOrder: 'sequenceOrder',
  requiredRole: 'requiredRole',
  triggerCondition: 'triggerCondition',
  isMandatory: 'isMandatory',
  requiresCompletionBeforeNext: 'requiresCompletionBeforeNext',
  autoAssignToRole: 'autoAssignToRole',
  notes: 'notes',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  eventId: 'eventId',
  orderId: 'orderId',
  productId: 'productId',
  assignedUserId: 'assignedUserId',
  name: 'name',
  description: 'description',
  category: 'category',
  status: 'status',
  priority: 'priority',
  dueDate: 'dueDate',
  startTime: 'startTime',
  endTime: 'endTime',
  estimatedDuration: 'estimatedDuration',
  actualDuration: 'actualDuration',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  completionNotes: 'completionNotes',
  requiresCustomerApproval: 'requiresCustomerApproval',
  customerApprovedAt: 'customerApprovedAt',
  blockedReason: 'blockedReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskDependencyScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  dependsOnTaskId: 'dependsOnTaskId',
  createdAt: 'createdAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  role: 'role',
  department: 'department',
  isPrimary: 'isPrimary',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'password',
  role: 'role',
  department: 'department',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.TaskTriggerCondition = exports.$Enums.TaskTriggerCondition = {
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  EVENT_CONFIRMED: 'EVENT_CONFIRMED',
  EVENT_PAID: 'EVENT_PAID',
  DAY_BEFORE: 'DAY_BEFORE',
  DAY_OF: 'DAY_OF',
  AFTER_EVENT: 'AFTER_EVENT'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  BLOCKED: 'BLOCKED'
};

exports.TaskPriority = exports.$Enums.TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.Prisma.ModelName = {
  Account: 'Account',
  StaffInvitation: 'StaffInvitation',
  Event: 'Event',
  EventItem: 'EventItem',
  EventItemOption: 'EventItemOption',
  EventStatusHistory: 'EventStatusHistory',
  Customer: 'Customer',
  Product: 'Product',
  Order: 'Order',
  OrderItem: 'OrderItem',
  OrderItemOption: 'OrderItemOption',
  OrderStatusHistory: 'OrderStatusHistory',
  HeroSetting: 'HeroSetting',
  ProductCategory: 'ProductCategory',
  ProductOption: 'ProductOption',
  ProductOptionValue: 'ProductOptionValue',
  TaskTemplate: 'TaskTemplate',
  Task: 'Task',
  TaskDependency: 'TaskDependency',
  UserRole: 'UserRole',
  User: 'User'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
