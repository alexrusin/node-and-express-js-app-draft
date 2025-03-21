import { Request } from "express";
import config from "@/config";
import { getErrorMessage, getPaginationParameters } from "@/utils";

describe("getErrorMessage", () => {
  test("should return message from an Error instance", () => {
    const error = new Error("Something went wrong");
    expect(getErrorMessage(error)).toBe("Something went wrong");
  });

  test("should return message from an object with a message property", () => {
    const error = { message: "Custom error message" };
    expect(getErrorMessage(error)).toBe("Custom error message");
  });

  test("should return message from an object with a non-string message property", () => {
    const error = { message: 12345 };
    expect(getErrorMessage(error)).toBe("12345");
  });

  test("should return string when passed a string error", () => {
    expect(getErrorMessage("String error message")).toBe(
      "String error message",
    );
  });

  test("should return default message for null", () => {
    expect(getErrorMessage(null)).toBe("An error occurred");
  });

  test("should return default message for undefined", () => {
    expect(getErrorMessage(undefined)).toBe("An error occurred");
  });

  test("should return default message for a number", () => {
    expect(getErrorMessage(404)).toBe("An error occurred");
  });

  test("should return default message for an empty object", () => {
    expect(getErrorMessage({})).toBe("An error occurred");
  });

  test("should return default message for an array", () => {
    expect(getErrorMessage(["error"])).toBe("An error occurred");
  });
});

describe("getPaginationParameters", () => {
  test("should return default values when page and perPage are missing", () => {
    const req = { query: {} } as Request;
    expect(getPaginationParameters(req)).toEqual({
      page: 1,
      perPage: config.defaultPageSize,
      limit: config.defaultPageSize,
      offset: 0,
    });
  });

  test("should parse valid page and perPage values", () => {
    const req = { query: { page: "2", perPage: "20" } } as unknown as Request;
    expect(getPaginationParameters(req)).toEqual({
      page: 2,
      perPage: 20,
      limit: 20,
      offset: 20,
    });
  });

  test("should default to page 1 if page is not a valid number", () => {
    const req = {
      query: { page: "invalid", perPage: "10" },
    } as unknown as Request;
    expect(getPaginationParameters(req)).toEqual({
      page: 1,
      perPage: 10,
      limit: 10,
      offset: 0,
    });
  });

  test("should default perPage to config.defaultPageSize if perPage is invalid", () => {
    const req = {
      query: { page: "3", perPage: "invalid" },
    } as unknown as Request;
    expect(getPaginationParameters(req)).toEqual({
      page: 3,
      perPage: config.defaultPageSize,
      limit: config.defaultPageSize,
      offset: (3 - 1) * config.defaultPageSize,
    });
  });

  test("should use defaults when page and perPage are negative", () => {
    const req = { query: { page: "-1", perPage: "-5" } } as unknown as Request;
    expect(getPaginationParameters(req)).toEqual({
      page: 1,
      perPage: config.defaultPageSize,
      limit: config.defaultPageSize,
      offset: 0,
    });
  });

  test("should handle zero as an invalid page and perPage", () => {
    const req = { query: { page: "0", perPage: "0" } } as unknown as Request;
    expect(getPaginationParameters(req)).toEqual({
      page: 1,
      perPage: config.defaultPageSize,
      limit: config.defaultPageSize,
      offset: 0,
    });
  });
});
