/* 
==============================================================================================
TemporaryImageMaker
Last Update:2018/04/19
https://github.com/yukichi0306/
==============================================================================================
*/
//"\n":改行

//ダイアログを表示=================================================================================
uDlg = new Window('dialog','TempImgMaker',[0,0,480,280]);
uDlg.center();
uDlg.sText1 = uDlg.add("statictext",[0,16,480,16+24],"CSVから読み込んだ文字列を基に、仮データを作ります。");
uDlg.sText1.justify = "center";
uDlg.sText = uDlg.add("statictext",[86,76,86+50,76+24], "CSV :");
uDlg.eText1 = uDlg.add("edittext",[148,76,148+200,76+24]);
uDlg.csvBtn = uDlg.add("button",[354,76,354+48,76+24], "file", {name: "csv"});
uDlg.sText = uDlg.add("statictext",[86,124,86+50,124+24], "保存先:");
uDlg.eText2 = uDlg.add("edittext",[148,124,148+200,124+24]);
uDlg.locatBtn = uDlg.add("button",[354,124,354+48,124+24], "folder", {name: "locat"});
uDlg.sText = uDlg.add("statictext",[86,172,86+50,172+24], "保存形式:");
uDlg.dList = uDlg.add("dropdownlist",[148,172,148+120,172+24],["Photoshop","PNG","Targa"]);
uDlg.dList.selection=1;
uDlg.cancelBtn = uDlg.add("button", [112,236,112+80,236+24], "キャンセル", {name: "cancel"});
uDlg.okBtn = uDlg.add("button",[288,236,288+80,236+24], "作成", { name:"ok"});

//CSVフォルダを選ぶ
uDlg.csvBtn.onClick = function ()
{
    var filename = File.openDialog("CSV")
    if(filename)
    {
    fileObj = new File(filename);
    csvname = fileObj.fsName;
    uDlg.eText1.text = csvname;
     }
}

//保存先フォルダを選ぶ
uDlg.locatBtn.onClick = function ()
{
    foldername = Folder.selectDialog("フォルダを選択してください");
    folderObj = new File(foldername);
    fsname = folderObj.fsName;
    uDlg.eText2.text = fsname;
}
    
//作成ボタンが押された時の処理
uDlg.okBtn.onClick = function ()
{
    var filename = uDlg.eText1.text;
    var fileObj = new File(filename);
    var flag1 = fileObj.exists;
    var foldername = uDlg.eText2.text + "\\";
    var folderObj = new Folder(foldername);
    var flag2 = folderObj.exists;
    if((flag1 == true) && (flag2 == true))
    {
        IdName();
        TempImgMake();
        uDlg.close();
        alert("Finish!");
    }
    else if((flag1 == false) && (flag2 == true))
    {
        alert("CSVが正しく選ばれていません。");
     }
    else if((flag1 == true) && (flag2 == false))
    {
        alert("フォルダが正しく選ばれていません。");
     }
    else if((flag1 == false) && (flag2 == false))
    {
        alert("ファイルとフォルダを確認してください。");
        }
}

//キャンセルボタンを押す時の処理
uDlg.cancelBtn.onClick = function ()
{
    uDlg.close();
}

uDlg.show();
//==============================================================================================

//CSVのデータを配列に=============================================================================
function IdName()
{
filename = uDlg.eText1.text;
fileObj = new File(filename);
flag = fileObj.open("r");
if (flag == true)
{
    var text = fileObj.read();
    IdArray = text.split("\n");
    fileObj.close();
}
else
{
alert("ファイルが開けませんでした");
}
}

//仮画像を生成する=========================================================================
function TempImgMake()
{
preferences.rulerUnits = Units.PIXELS;
saveLocation = uDlg.eText2.text + "\\";
//PSD save
if(uDlg.dList.selection == 0)
{
    for(i=0; i<IdArray.length-1; i++)
    {
    psdFile = new File(saveLocation+IdArray[i]+".psd");
    psdOpt = new PhotoshopSaveOptions();
    psdOpt.alphaChannels = true;
    psdOpt.annotations = true;
    psdOpt.embedColorProfile = false;
    psdOpt.layers = true;
    psdOpt.spotColors = false;
    activeDocument.saveAs(psdFile, psdOpt, true, Extension.LOWERCASE);
    }
}
//PNG save
else if(uDlg.dList.selection == 1)
{
    for(i=0; i<IdArray.length-1; i++)
    {
    pngFile = new File(saveLocation+IdArray[i]+".png");//パス指定とファイル名
    pngOpt = new PNGSaveOptions();
    pngOpt.interlaced = false;
    activeDocument.saveAs(pngFile, pngOpt, true, Extension.LOWERCASE);
    }
}

//Targa save
else if(uDlg.dList.selection == 2)
{
    for(i=0; i<IdArray.length-1; i++)
    {
    targaFile = new File(saveLocation+IdArray[i]+".tga");
    tgaOpt = new TargaSaveOptions();
    tgaOpt.alphaChannels = true;
    tgaOpt.resolution = TargaBitsPerPixels.THIRTYTWO;
    tgaOpt.rleCompression = false;
    activeDocument.saveAs(targaFile, tgaOpt, true, Extension.LOWERCASE);
    }
}
}