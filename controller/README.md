
# Compiling Spark-core firmware and flushing the device

Modify the firmware to point to application server. For development purposes you can use localhost ip address (reachable within the local area network):

```
$ cd core-firmware 
$ sed -i.bak "s/device.spark.io/192.168.1.2/g" src/spark_utilities.cpp
```

Install arm compiler:

```
$ wget -O install-compiler.sh https://gist.githubusercontent.com/dmitriykuptsov/eeffe3a91119db617975/raw/bfc0c96fef22899e660c70ccdde8c96f5a00c249/install%20and%20add%20gcc%20arm%20to%20PATH.sh
$ sudo bash install-compiler.sh
```

Compile firmware:

```
$ cd core-firmware/build
$ make
```

To flush the device follow the instructions at:

To setup wifi follow the instructions at:


