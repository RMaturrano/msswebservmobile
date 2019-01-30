$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query;
var rs;
var i;

try{
 
    var empId = $.request.parameters.get('empId');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = ' SELECT \'EstadoCuenta1\' AS "TipoReporte",  ' +
                    '	T0."CardCode" AS "Cliente", ' +
                    '	T0."CardName" AS "Nombre", ' +
                    '	T5."ListName" AS "ListaPrecio", ' +
                    '	T4."CreditLine" AS "LineaCredito", ' +
                    '	T2."PymntGroup" AS "CondicionPago", ' +
                    '	T0."DocEntry" AS "Clave", ' +
                    '	T0."FolioPref" || \'-\' || LPAD(CAST(T0."FolioNum" AS NVARCHAR),7, \'0\') AS "Sunat", ' +
                    '	CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion", ' +
                    '	T1."SlpName" AS "Vendedor", ' +
                    '	TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision", ' +
                    '	T0."DocCur" AS "Moneda", ' +
                    '	T0."DocTotal" AS "Total", ' +
                    '	(T0."DocTotal"-T0."PaidToDate") AS "Saldo", ' +
                    '	\'\' AS "Pago_Fecha", ' +
                    '	0 AS "Pago_Dias", ' +
                    '	\'\' AS "Pago_Moneda", ' +
                    '	0 AS "Pagado_Importe" ' +
                  '  FROM '+dbname+'.OINV T0  ' +
                    '	INNER JOIN '+dbname+'.OSLP T1 ON T1."SlpCode" = T0."SlpCode" AND T1."SlpCode" <> -1  ' +
                    '		AND T0."FolioPref" is not null AND T0."FolioNum" IS NOT NULL ' +
                    '	INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = T0."GroupNum" ' +
                    '	INNER JOIN '+dbname+'.NNM1 T3 ON T0."Series" = T3."Series" ' + // AND T3."BeginStr" IN (\'01\',\'03\') ' +
                    '	INNER JOIN '+dbname+'.OCRD T4 ON T4."CardCode" = T0."CardCode" AND T4."CardType" <> \'S\' AND T4."validFor" = \'Y\'  ' +
                    '		AND T4."frozenFor" = \'N\' ' +
                    '	INNER JOIN '+dbname+'.OPLN T5 ON T5."ListNum" = T4."ListNum" ' +
                  '  WHERE IFNULL(T0."FolioNum",0) <> 0  ' +
                    '	AND T0."CANCELED" = \'N\' ' +
                    '	AND T0."DocTotal" <> T0."PaidToDate" ' +
                    '	UNION ' +
                  '  SELECT ' +
                    '	\'EstadoCuenta1\' AS "TipoReporte", ' +
                    '	T0."CardCode" AS "Cliente", ' +
                    '	T0."CardName" AS "Nombre", ' +
                    '	T5."ListName" AS "ListaPrecio", ' +
                    '	T4."CreditLine" AS "LineaCredito", ' +
                    '	T2."PymntGroup" AS "CondicionPago", ' +
                    '	T0."DocEntry" AS "Clave", ' +
                    '	T0."FolioPref" || \'-\' || LPAD(CAST(T0."FolioNum" AS NVARCHAR),7, \'0\') AS "Sunat", ' +
                    '	CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion", ' +
                    '	T1."SlpName" AS "Vendedor", ' +
                    '	TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision", ' +
                    '	T0."DocCur" AS "Moneda", ' +
                    '	(T0."DocTotal"*-1) AS "Total", ' +
                    '	((T0."DocTotal"-T0."PaidToDate")*-1) AS "Saldo", ' +
                    '	\'\' AS "Pago_Fecha", ' +
                    '	0 AS "Pago_Dias", ' +
                    '	\'\' AS "Pago_Moneda", ' +
                    '	0 AS "Pagado_Importe" ' +
                 '   FROM '+dbname+'.ORIN T0  ' +
                    '	INNER JOIN '+dbname+'.OSLP T1 ON T1."SlpCode" = T0."SlpCode" AND T1."SlpCode" <> -1 ' +
                    '	INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = T0."GroupNum" ' +
                    '	INNER JOIN '+dbname+'.NNM1 T3 ON T0."Series" = T3."Series" ' + // AND T3."BeginStr" IN (\'01\',\'03\') ' +
                    '	INNER JOIN '+dbname+'.OCRD T4 ON T4."CardCode" = T0."CardCode" AND T4."CardType" <> \'S\'  ' +
                    '		AND T4."validFor" = \'Y\' AND T4."frozenFor" = \'N\' ' +
                    '	INNER JOIN '+dbname+'.OPLN T5 ON  T4."ListNum" = T5."ListNum" ' +
                  '  WHERE IFNULL(T0."FolioNum",0) <> 0  ' +
                    '	AND T0."CANCELED" = \'N\' ' +
                    '   AND T0."DocSubType" <> \'DN\' ' + 
                    '	AND T0."DocTotal" <> T0."PaidToDate" ' +
                    '	UNION ' +
                    ' SELECT \'EstadoCuenta1\' AS "TipoReporte",   ' +
                    '    	T0."CardCode" AS "Cliente",   ' +
                    '    	T0."CardName" AS "Nombre",   ' +
                    '    	T5."ListName" AS "ListaPrecio",  ' + 
                    '    	T4."CreditLine" AS "LineaCredito",   ' +
                    '    	T2."PymntGroup" AS "CondicionPago",   ' +
                    '    	T0."DocEntry" AS "Clave",   ' +
                    '    	T0."FolioPref" || \'-\' || LPAD(CAST(T0."FolioNum" AS NVARCHAR),7, 0) AS "Sunat",   ' +
                    '    	CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion",   ' +
                    '    	\'\' AS "Vendedor",   ' +
                    '    	TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision",   ' +
                    '    	T0."DocCur" AS "Moneda",   ' +
                    '    	(T0."DocTotal"*-1) AS "Total", ' +  
                    '    	((T0."DocTotal"-T0."PaidToDate")*-1) AS "Saldo",   ' +
                    '    	\'\' AS "Pago_Fecha",   ' +
                    '    	0 AS "Pago_Dias",   ' +
                    '    	\'\' AS "Pago_Moneda",   ' +
                    '    	0 AS "Pagado_Importe"   ' +
                    '       FROM '+dbname+'.ORIN T0  ' +
                    '    INNER JOIN '+dbname+'.RIN1 T1 ON T0."DocEntry" = T1."DocEntry"  ' +
                    '    INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = T0."GroupNum" ' +
                    '    INNER JOIN '+dbname+'.OCRD T4 ON T0."CardCode" = T4."CardCode" ' +
                    '    INNER JOIN '+dbname+'.OPLN T5 ON  T4."ListNum" = T5."ListNum" ' +
                    '    WHERE  T0."CANCELED" = \'N\'  AND T0."DocSubType" <> \'DN\'  ' + 
                    '    AND (CASE WHEN T0."DocTotal" <> T0."PaidToDate" THEN \'O\' ELSE \'C\' END) = \'O\'  ' +
                    '    AND T0."DocStatus" = \'O\'   '+
                    '   UNION '+
                    ' SELECT  \'EstadoCuenta1\' AS "TipoReporte",  ' +
                    '		Y0."CardCode" AS "Cliente",    ' +
                    '		Y0."CardName" AS "Nombre",    ' +
                    '		T5."ListName" AS "ListaPrecio",    ' +
                    '		Y0."CreditLine" AS "LineaCredito",    ' +
                    '		T2."PymntGroup" AS "CondicionPago",    ' +
                    '		T0."TransId" AS "Clave",    ' +
                    '		\'\' AS "Sunat",    ' +
                    '		CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion",    ' +
                    '		\'\' AS "Vendedor",    ' +
                    '		TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision",    ' +
                    '		T0."TransCurr" AS "Moneda",    ' +
                    '		CASE WHEN T1."Debit" = 0 THEN T1."Credit" * -1 ELSE T1."Debit" END AS "Total",    ' +
                    '		CASE WHEN T1."Debit" = 0 THEN T1."Credit" * -1 ELSE T1."Debit" END AS "Saldo",    ' +
                    '		\'\' AS "Pago_Fecha",    ' +
                    '		0 AS "Pago_Dias",    ' +
                    '		\'\' AS "Pago_Moneda",    ' +
                    '		0 AS "Pagado_Importe"    ' +
                    '    FROM '+dbname+'.OJDT T0   ' +
                    '    INNER JOIN '+dbname+'.JDT1 T1 ON T0."TransId" = T1."TransId"   ' +
                    '	INNER JOIN '+dbname+'.OCRD Y0 ON T1."ShortName" = Y0."CardCode"   ' +
                    '    INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = Y0."GroupNum"  ' +
                    '	INNER JOIN '+dbname+'.OPLN T5 ON T5."ListNum" = Y0."ListNum"  ' +
                    ' WHERE T0."TransType" = 30   ' +
                    ' AND T0."BtfStatus" = \'O\'  ' +
                    ' AND (T1."BalDueDeb" <> 0  OR T1."BalDueCred" <> 0)   ' +
                    '   UNION ' + 
                  '  SELECT  ' +
                    '	\'EstadoCuenta2\' AS "Tipo", ' +
                    '	T0."CardCode" AS "Cliente", ' +
                    '	T0."CardName" AS "Nombre", ' +
                    '	T7."ListName" AS "ListaPrecio", ' +
                    '	T6."CreditLine" AS "LineaCredito", ' +
                    '	T2."PymntGroup" AS "CondicionPago", ' +
                    '	T0."DocEntry" AS "Clave", ' +
                    '	T0."FolioPref" || \'-\' || LPAD(CAST(T0."FolioNum" AS NVARCHAR),7, \'0\') AS "Sunat", ' +
                    '	CASE WHEN T2."PymntGroup" LIKE \'%CONTADO%\' THEN \'CONTADO\' ELSE \'CREDITO\' END AS "Condicion", ' +
                    '	T1."SlpName" AS "Vendedor", ' +
                    '	TO_VARCHAR(T0."TaxDate", \'YYYYMMDD\') AS "Emision", ' +
                    '	T0."DocCur" AS "Moneda", ' +
                    '	(T0."DocTotal") AS "Total", ' +
                    '	(T0."DocTotal"-T0."PaidToDate") AS "Saldo", ' +
                    '	TO_VARCHAR(T0."DocDate", \'YYYYMMDD\') AS "Pago_Fecha", ' +
                    '	DAYS_BETWEEN(T0."TaxDate",T4."DocDate") AS "Pago_Dias", ' +
                    '	T4."DocCurr" AS "Pago_Moneda",	 ' +
                    '	T3."SumApplied" AS "Pagado_Importe" ' +
                   ' FROM '+dbname+'.OINV T0  ' +
                    '	INNER JOIN '+dbname+'.OSLP T1 ON T1."SlpCode" = T0."SlpCode" AND T1."SlpCode" <> -1 ' +
                    '	INNER JOIN '+dbname+'.OCTG T2 ON T2."GroupNum" = T0."GroupNum" ' +
                    '	INNER JOIN '+dbname+'.RCT2 T3 ON T3."InvType" = T0."ObjType" AND T3."DocEntry" = T0."DocEntry" ' +
                    '	INNER JOIN '+dbname+'.ORCT T4 ON T4."DocEntry" = T3."DocNum" AND T4."Canceled" = \'N\' ' +
                    '	INNER JOIN '+dbname+'.NNM1 T5 ON T0."Series" = T5."Series" ' + // AND T5."BeginStr" IN (\'01\',\'03\') ' +
                    '	INNER JOIN '+dbname+'.OCRD T6 ON T6."CardCode" = T0."CardCode" AND T6."CardType" <> \'S\'  ' +
                    '			AND T6."validFor" = \'Y\' AND T6."frozenFor" = \'N\' ' +
                    '	INNER JOIN '+dbname+'.OPLN T7 ON T7."ListNum" = T6."ListNum" ' +
                   '  WHERE IFNULL(T0."FolioNum",0) <> 0 AND T0."CANCELED" = \'N\' ' +
                    '	AND DAYS_BETWEEN(T0."TaxDate",CURRENT_DATE) <= 30 ' +
                   ' ORDER BY 1,5,6,3 ASC;'; 
	        
    	var conn = $.hdb.getConnection();
    	rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    		var mResult = [];
    		
    		for(i = 0; i < rs.length ; i++)
    		{
        		mResult.push(rs[i]);
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
    	    functions.DisplayJSON(objResponse, objType);
    	    
    	}else{
    	    objType = "MessageError";
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	    objResponse = functions.CreateResponse(objType, objResult, 0);
    	    functions.DisplayJSON(objResponse, objType);
    	}
    	 
	}else{
	    objType = "MessageError";
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	    objResponse = functions.CreateResponse(objType, objResult, 0);
	    functions.DisplayJSON(objResponse, objType);
	} 
	
}catch(e){
    objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message + ' --- ' + rs[i]);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}