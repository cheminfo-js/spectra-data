# Documentation
 
This library provides a complete suite of tools for treatment of spectra data. The basic features of SD.js allows to open and
make basic processing for IR, MASS, UV and GC spectra.
There are tow specialization of the SD library for NMR and NMR2D. In this document you will find the documentation for those 3 classes.
 
[SD](#SD)  
[NMR](#NMR)  
[NMR2D](#NMR2D)
 
# SD

## `function SD(sd)`

Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)

 * **Parameters:** `sd` — 
 * **Constructor**

## `SD.fromJcamp = function(jcamp, options)`

Construct the object from the given jcamp.

 * **Parameters:**
   * `jcamp` — 
   * `options` — 
 * **Returns:** `SD` — 

## `SD.prototype.setActiveElement = function(nactiveSpectrum)`

This function sets the nactiveSpectrum sub-spectrum as active

 * **Parameters:** `index` — the sub-spectrum to set as active

## `SD.prototype.getActiveElement = function()`

This function returns the index of the active sub-spectrum.

 * **Returns:** `number|*` — 

## `SD.prototype.getXUnits = function()`

This function returns the units of the independent dimension.

 * **Returns:** `xUnit|*|M.xUnit` — 

## `SD.prototype.setXUnits = function(units)`

This function returns the units of the independent dimension.

 * **Returns:** `xUnit|*|M.xUnit` — 

## `SD.prototype.getYUnits = function()`

* This function returns the units of the dependent variable.

 * **Returns:** `yUnit|*|M.yUnit` — 

## `SD.prototype.getSpectraVariable = function(dim)`

This function returns the information about the dimensions

 * **Returns:** `*` — 

## `SD.prototype.getNbPoints=function(i)`

Return the number of points in the current spectrum

 * **Parameters:** `i` — 
 * **Returns:** `*` — 

## `SD.prototype.getFirstX=function(i)`

Return the first value of the direct dimension

 * **Parameters:** `i` — 
 * **Returns:** `number` — 

## `SD.prototype.setFirstX=function(x, i)`

Set the firstX for this spectrum. You have to force and update of the xAxis after!!!

 * **Parameters:**
   * `x` — 
   * `i` — 

## `SD.prototype.getLastX=function(i)`

Return the last value of the direct dimension

 * **Parameters:** `i` — 
 * **Returns:** `number` — 

## `SD.prototype.setLastX=function(x, i)`

Set the last value of the direct dimension. You have to force and update of the xAxis after!!!

 * **Parameters:**
   * `x` — 
   * `i` — 

## `SD.prototype.getFirstY=function(i)`

Return the first value of the direct dimension

 * **Parameters:** `i` — 
 * **Returns:** `number` — 

## `SD.prototype.setFirstY=function(y, i)`

Set the first value of the indirect dimension. Only valid for 2D spectra.

 * **Parameters:**
   * `y` — 
   * `i` — 

## `SD.prototype.getLastY = function(i)`

Return the first value of the indirect dimension. Only valid for 2D spectra.

 * **Returns:** `number` — 

## `SD.prototype.setLastY = function(y, i)`

Return the first value of the indirect dimension

 * **Parameters:**
   * `y` — 
   * `i` — 

## `SD.prototype.setDataClass = function(dataClass)`

Set the spectrum data_class. It could be DATACLASS_PEAK=1 or DATACLASS_XY=2

 * **Parameters:** `dataClass` — 

## `SD.prototype.isDataClassPeak = function()`

Is this a PEAKTABLE spectrum?

 * **Returns:** `*` — 

## `SD.prototype.isDataClassXY = function()`

Is this a XY spectrum?

 * **Returns:** `*` — 

## `SD.prototype.setDataType = function(dataType)`

Set the data type for this spectrum. It could be one of the following: "UV", "RAMAN" "GC"|| "GASCHROMATOGRAPH","CD"|| "DICHRO","XY","DEC"]

 * **Parameters:** `dataType` — 

## `SD.prototype.getDataType = function()`

Return the dataType(see: setDataType )

 * **Returns:** `string|string|*|string` — 

## `SD.prototype.getSpectrumData=function(i)`

Return the i-th sub-spectrum data in the current spectrum

 * **Parameters:** `i` — 
 * **Returns:** `this.sd.spectra[i].data[0]` — 

## `SD.prototype.getSpectrum=function(i)`

Return the i-th sub-spectra in the current spectrum

 * **Parameters:** `i` — 
 * **Returns:** `this.sd.spectra[i]` — 

## `SD.prototype.getNbSubSpectra=function()`

Return the amount of sub-spectra in this object

 * **Returns:** `*` — 

## `SD.prototype.getXData=function(i)`

Returns an array containing the x values of the spectrum

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `Array` — 

## `SD.prototype.getYData=function(i)`

This function returns a double array containing the values with the intensities for the current sub-spectrum.

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `Array` — 

## `SD.prototype.getX=function(i)`

Returns the x value at the specified index for the active sub-spectrum.

 * **Parameters:** `i` — index between 0 and spectrum.getNbPoints()-1
 * **Returns:** `number` — 

## `SD.prototype.getY=function(i)`

Returns the y value at the specified index for the active sub-spectrum.

 * **Parameters:** `i` — index between 0 and spectrum.getNbPoints()-1
 * **Returns:** `number` — 

## `SD.prototype.getXYData=function(i)`

Returns a double[2][nbPoints] where the first row contains the x values and the second row the y values.

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `*[]` — 

## `SD.prototype.getTitle=function(i)`

Return the title of the current spectrum.

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `*` — 

## `SD.prototype.setTitle=function(newTitle,i)`

Set the title of this spectrum.

 * **Parameters:**
   * `newTitle` — new title
   * `i` — Default:activeSpectrum

## `SD.prototype.getMinY=function(i)`

This function returns the minimal value of Y

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `number` — 

## `SD.prototype.getMaxY=function(i)`

This function returns the maximal value of Y

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `number` — 

## `SD.prototype.getMinMaxY=function(i)`

Return the min and max value of Y

 * **Parameters:** `i` — Default:activeSpectrum
 * **Returns:** `{min` — max}|*}

## `SD.prototype.getNoiseLevel=function()`

Get the noise threshold level of the current spectrum. It uses median instead of the mean

 * **Returns:** `number` — 

## `SD.prototype.arrayPointToUnits=function(doublePoint)`

Return the xValue for the given index.

 * **Parameters:** `doublePoint` — 
 * **Returns:** `number` — 

## `SD.prototype.unitsToArrayPoint=function(inValue)`

Returns the index-value for the data array corresponding to a X-value in units for the element of spectraData to which it is linked (spectraNb). This method makes use of spectraData.getFirstX(), spectraData.getLastX() and spectraData.getNbPoints() to derive the return value if it of data class XY It performs a binary search if the spectrum is a peak table (value in Units to be converted)

 * **Parameters:** `inValue` — 
 * **Returns:** `number` — An integer representing the index value of the inValue

## `SD.prototype.getDeltaX=function()`

Returns the separation between 2 consecutive points in the spectrum domain

 * **Returns:** `number` — 

## `SD.prototype.setMinMax=function(min,max)`

This function scales the values of Y between the min and max parameters

 * **Parameters:**
   * `min` — desired value for Y
   * `max` — desired value for Y

## `SD.prototype.setMin=function(min)`

This function scales the values of Y to fit the min parameter

 * **Parameters:** `min` — desired value for Y

## `SD.prototype.setMax=function(max)`

This function scales the values of Y to fit the max parameter

 * **Parameters:** `max` — desired value for Y

## `SD.prototype.YShift=function(value)`

This function shifts the values of Y

 * **Parameters:** `value` — of the shift

## `SD.prototype.shift=function(globalShift)`

This function shift the given spectraData. After this function is applied, all the peaks in the spectraData will be found at xi+globalShift

 * **Parameters:** `globalShift` — 

## `SD.prototype.fillWith=function(from, to, value)`

This function fills a zone of the spectrum with the given value.

 * **Parameters:**
   * `from` — 
   * `to` — 
   * `fillWith` — 

## `SD.prototype.suppressZone=function(from, to)`

This function suppress a zone from the given spectraData within the given x range. Returns a spectraData of type PEAKDATA without peaks in the given region

 * **Parameters:**
   * `from` — 
   * `to` — 

## `SD.prototype.simplePeakPicking=function(parameters)`

This function performs a simple peak detection in a spectraData. The parameters that can be specified are: Returns a two dimensional array of double specifying [x,y] of the detected peaks. experimental spectra, smoothing will make the algorithm less prune to false positives.


## `SD.prototype.getMaxPeak = function()`

Get the maximum peak

 * **Returns:** `[x` — y]}

## `SD.prototype.getParamDouble = function(name, defvalue)`

Get the value of the parameter

 * **Parameters:**
   * `name` — parameter name
   * `defvalue` — default value
 * **Returns:** `number` — 

## `SD.prototype.getParamString = function(name, defvalue)`

Get the value of the parameter

 * **Parameters:**
   * `name` — parameter name
   * `defvalue` — default value
 * **Returns:** `string` — 

## `SD.prototype.getParamInt = function(name, defvalue)`

Get the value of the parameter

 * **Parameters:**
   * `name` — parameter name
   * `defvalue` — default value
 * **Returns:** `number` — 

## `SD.prototype.getParam = function(name, defvalue)`

Get the value of the parameter

 * **Parameters:**
   * `name` — parameter name
   * `defvalue` — default value
 * **Returns:** `*` — 

## `SD.prototype.containsParam = function(name)`

 * **Parameters:** `name` — 
 * **Returns:** `boolean` — 

## `SD.prototype.getSpectraDataY = function()`

Return the y elements of the current spectrum. Same as getYData. Kept for backward compatibility.

 * **Returns:** `Array` — 

## `SD.prototype.getSpectraDataX = function()`

Return the x elements of the current spectrum. Same as getXData. Kept for backward compatibility.

 * **Returns:** `Array` — 

## `SD.prototype.resetMinMax = function()`

Update min max values of X and Yaxis.


## `SD.prototype.putParam = function(name, value)`

Set a new parameter to this spectrum

 * **Parameters:**
   * `name` — 
   * `value` — 

## `SD.prototype.getArea = function(from, to)`

This function returns the area under the spectrum in the given window

 * **Parameters:**
   * `from` — spectrum units
   * `to` — spectrum units
 * **Returns:** `number` — 

## `SD.prototype.getVector = function(from, to, nPoints)`

Returns a equally spaced vector within the given window.

 * **Parameters:**
   * `from` — spectrum units
   * `to` — spectrum units
   * `nPoints` — of points to return(!!!sometimes it is not possible to return exactly the required nbPoints)
 * **Returns:** `x,y` — 

## `SD.prototype.is2D = function()`

Is it a 2D spectrum?

 * **Returns:** `boolean` — 

## `SD.prototype.toJcamp=function(options)`

This function creates a String that represents the given spectraData in the format JCAM-DX 5.0 The X,Y data can be compressed using one of the methods described in: "JCAMP-DX. A STANDARD FORMAT FOR THE EXCHANGE OF ION MOBILITY SPECTROMETRY DATA", http://www.iupac.org/publications/pac/pdf/2001/pdf/7311x1765.pdf

 * **Returns:** `` — string containing the jcamp-DX file
 * **Example:** SD.toJcamp(spectraData,{encode:'DIFDUP',yfactor:0.01,type:"SIMPLE",keep:['#batchID','#url']});

 
# NMR
 
# Documentation

## `function NMR(sd)`

Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)

 * **Parameters:** `sd` — 
 * **Constructor**

## `NMR.fromJcamp = function(jcamp,options)`

Construct the object from the given jcamp.

 * **Parameters:**
   * `jcamp` — 
   * `options` — 
 * **Returns:** `NMR` — 

## `NMR.prototype.getNucleus=function(dim)`

Returns the observed nucleus. A dimension parameter is accepted for compatibility with 2DNMR

 * **Parameters:** `dim` — 
 * **Returns:** `*` — 

## `NMR.prototype.getSolventName=function()`

Returns the solvent name.

 * **Returns:** `string|XML` — 

## `NMR.prototype.observeFrequencyX=function()`

Returns the observe frequency in the direct dimension

 * **Returns:** `number` — 

## `NMR.prototype.getNMRPeakThreshold=function(nucleus)`

Returns the noise factor depending on the nucleus.

 * **Parameters:** `nucleus` — 
 * **Returns:** `number` — 

## `NMR.prototype.addNoise=function(SNR)`

This function adds white noise to the the given spectraData. The intensity of the noise is calculated from the given signal to noise ratio.

 * **Parameters:** `SNR` — to noise ratio
 * **Returns:** `hi` — object

## `NMR.prototype.addSpectraDatas=function(spec2,factor1,factor2,autoscale )`

This filter performs a linear combination of two spectraDatas. A=spec1 B=spec2 After to apply this filter you will get: A=A*factor1+B*factor2 if autoscale is set to 'true' then you will obtain: A=A*factor1+B*k*factor2 Where the k is a factor such that the maximum peak in A is equal to the maximum peak in spectraData2

 * **Parameters:**
   * `spec2` — 
   * `factor1` — factor for spec1
   * `factor2` — factor for spec2
   * `autoscale` — scales before combine the spectraDatas
 * **Returns:** `hi` — object
 * **Example:** spec1 = addSpectraDatas(spec1,spec2,1,-1, false) This subtract spec2 from spec1

## `NMR.prototype.autoBaseline=function( )`

Automatically corrects the base line of a given spectraData. After this process the spectraData should have meaningful integrals.

 * **Returns:** `hi` — object

## `NMR.prototype.fourierTransform=function( )`

Fourier transforms the given spectraData (Note. no 2D handling yet) this spectraData have to be of type NMR_FID or 2DNMR_FID

 * **Returns:** `hi` — object

## `NMR.prototype.postFourierTransform=function(ph1corr)`

This filter makes an phase 1 correction that corrects the problem of the spectra that has been obtained on spectrometers using the Bruker digital filters. This method is used in cases when the BrukerSpectra filter could not find the correct number of points to perform a circular shift. The actual problem is that not all of the spectra has the necessary parameters for use only one method for correcting the problem of the Bruker digital filters.

 * **Parameters:**
   * `spectraData` — fourier transformed spectraData.
   * `ph1corr` — 1 correction value in radians.
 * **Returns:** `hi` — object

## `NMR.prototype.zeroFilling=function(nPointsX, nPointsY)`

This function increase the size of the spectrum, filling the new positions with zero values. Doing it one could increase artificially the spectral resolution.

 * **Parameters:**
   * `nPointsX` — of new zero points in the direct dimension
   * `nPointsY` — of new zero points in the indirect dimension
 * **Returns:** `hi` — object

## `NMR.prototype.haarWhittakerBaselineCorrection=function(waveletScale,whittakerLambda)`

Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013 The needed parameters are the wavelet scale and the lambda used in the whittaker smoother.

 * **Parameters:**
   * `waveletScale` — be described
   * `whittakerLambda` — be described
 * **Returns:** `hi` — object

## `NMR.prototype.whittakerBaselineCorrection=function(whittakerLambda,ranges)`

Applies a baseline correction as described in J Magn Resonance 183 (2006) 145-151 10.1016/j.jmr.2006.07.013 The needed parameters are the Wavelet scale and the lambda used in the Whittaker smoother.

 * **Parameters:**
   * `waveletScale` — be described
   * `whittakerLambda` — be described
   * `ranges` — string containing the ranges of no signal.
 * **Returns:** `hi` — object

## `NMR.prototype.brukerFilter=function()`

This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID

 * **Returns:** `hi` — object

## `NMR.prototype.digitalFilter=function(options)`

This filter applies a circular shift(phase 1 correction in the time domain) to an NMR FID spectrum that have been obtained on spectrometers using the Bruker digital filters. The amount of shift depends on the parameters DECIM and DSPFVS. This spectraData have to be of type NMR_FID and negative values will do to the left.

 * **Returns:** `hi` — object

## `NMR.prototype.apodization=function(functionName, lineBroadening)`

Apodization of a spectraData object. Exponential, exp Hamming, hamming Gaussian, gauss TRAF, traf Sine Bell, sb Sine Bell Squared, sb2 or alternatively an angle given by degrees for sine bell functions and the like.

 * **Parameters:**
   * `spectraData` — spectraData of type NMR_FID
   * `functionName` — values for functionsName are
   * `lineBroadening` — parameter LB should either be a line broadening factor in Hz
 * **Returns:** `hi` — object
 * **Example:** SD.apodization("exp", lineBroadening)

## `NMR.prototype.echoAntiechoFilter=function()`

That decodes an Echo-Antiecho 2D spectrum.

 * **Returns:** `hi` — object

## `NMR.prototype.SNVFilter=function()`

This function apply a Standard Normal Variate Transformation over the given spectraData. Mainly used for IR spectra.

 * **Returns:** `hi` — object

## `NMR.prototype.powerFilter=function(power)`

This function applies a power to all the Y values.<br>If the power is less than 1 and the spectrum has negative values, it will be shifted so that the lowest value is zero

 * **Parameters:** `power` — power to apply
 * **Returns:** `hi` — object

## `NMR.prototype.logarithmFilter=function(base)`

This function applies a log to all the Y values.<br>If the spectrum has negative or zero values, it will be shifted so that the lowest value is 1

 * **Parameters:** `base` — base to use
 * **Returns:** `hi` — object

## `NMR.prototype.correlationFilter=function(func)`

This function correlates the given spectraData with the given vector func. The correlation operation (*) is defined as: 

__ inf c(x)=f(x)(*)g(x)= \ f(x)*g(x+i) ./ -- i=-inf given spectraData.

 * **Parameters:** `func` — double array containing the function to correlates the spectraData
 * **Returns:** `hi` — object
 * **Example:** var smoothedSP = SD.correlationFilter(spectraData,[1,1]) returns a smoothed version of the

## `NMR.prototype.phaseCorrection=function(phi0, phi1)`

Applies the phase correction (phi0,phi1) to a Fourier transformed spectraData. The angles must be given in radians.

 * **Parameters:**
   * `phi0` — order phase correction
   * `phi1` — order phase correction
 * **Returns:** `hi` — object

## `NMR.prototype.automaticPhase=function()`

This function determines automatically the correct parameters phi0 and phi1 for a phaseCorrection function and applies it.

 * **Returns:** `hi` — object

## `NMR.prototype.nmrPeakDetection=function(parameters)`

This function process the given spectraData and tries to determine the NMR signals. Returns an NMRSignal1D array containing all the detected 1D-NMR Signals

 * **Parameters:** `parameters` — JSONObject containing the optional parameters:
 * **Returns:** `*` — 

 
# NMR2D

# Documentation

## `function NMR2D(sd)`

Construct the object from the given sd object(output of the jcampconverter or brukerconverter filter)

 * **Parameters:** `sd` — 
 * **Constructor**

## `NMR2D.fromJcamp = function(jcamp,options)`

Construct the object from the given jcamp.

 * **Parameters:**
   * `jcamp` — 
   * `options` — 
 * **Returns:** `NMR2D` — 

## `NMR2D.prototype.isHomoNuclear=function()`

Returns true if the it is an homo-nuclear experiment

 * **Returns:** `boolean` — 

## `NMR2D.prototype.observeFrequencyX=function()`

Returns the observe frequency in the direct dimension

 * **Returns:** `*` — 

## `NMR2D.prototype.observeFrequencyY=function()`

Returns the observe frequency in the indirect dimension

 * **Returns:** `*` — 

## `NMR2D.prototype.getSolventName=function()`

Returns the solvent name.

 * **Returns:** `string|XML` — 

## `NMR2D.prototype.getXUnits = function()`

This function returns the units of the direct dimension. It overrides the SD getXUnits function

 * **Returns:** `ntuples.units|*|b.units` — 

## `NMR2D.prototype.getYUnits = function()`

This function returns the units of the indirect dimension. It overrides the SD getYUnits function

 * **Returns:** `ntuples.units|*|b.units` — 

## `NMR2D.prototype.getZUnits = function()`

Returns the units of the dependent variable

 * **Returns:** `ntuples.units|*|b.units` — 

## `NMR2D.prototype.getLastY = function()`

Returns the min value in the indirect dimension.

 * **Returns:** `sd.minMax.maxY` — 

## `NMR2D.prototype.getFirstY = function()`

Returns the min value in the indirect dimension.

 * **Returns:** `sd.minMax.minY` — 

## `NMR2D.prototype.getDeltaY=function()`

Returns the separation between 2 consecutive points in the indirect domain

 * **Returns:** `number` — 

## `NMR2D.prototype.nmrPeakDetection2D=function(options)`

This function process the given spectraData and tries to determine the NMR signals.

 * **Parameters:** `options:+Object` — containing the options
 * **Returns:** `*` — set of NMRSignal2D

## `NMR2D.prototype.getNMRPeakThreshold=function(nucleus)`

Returns the noise factor depending on the nucleus.

 * **Parameters:** `nucleus` — 
 * **Returns:** `number` — 

## `NMR2D.prototype.getNucleus=function(dim)`

Returns the observed nucleus in the specified dimension

 * **Parameters:** `dim` — 
 * **Returns:** `string` — 

